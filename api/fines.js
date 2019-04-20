import cheerio from 'react-native-cheerio'
import fetch from 'node-fetch'

const getFormParams = html => {
    const keys = ["__LASTFOCUS", "__EVENTTARGET", "__EVENTARGUMENT", "__VIEWSTATE", "__EVENTVALIDATION", "SenderID", "RandomSecret", "RequestObject", "HasedRequestObject", "cSearch$PlateFormat", "cSearch$txtPlateAlpaNum$txtFL", "cSearch$txtPlateAlpaNum$txtSL", "cSearch$txtPlateAlpaNum$txtTL", "cSearch$txtPlateAlpaNum$txtDg", "cSearch$txtPlateNum", "cSearch$btnSearch", "cSearch$ddlPlateType", "cSearch$ddlGovern"]
    const $ = cheerio.load(html)
    const params = {}
    $('input').each((i, ele) => {
        if (keys.indexOf($(ele).attr("name")) != -1)
            params[$(ele).attr("name")] =  $(ele).val() || ""
    })
    return params
}

const parseFines = html => {
    const $ = cheerio.load(html)
    const finesText = $('#cFinesSummary_lblTotalNew').text()
    const finesValue = +finesText.split(' ')[0]
    if (finesValue !== NaN)
        return finesValue
    return 0
}

export const PLATE_FORMAT = {
    ALPHA_NUMERIC: "rdAlphaNum",
    NUMERIC: "rdNum",
}

export const getFines = async (driverLicenseDataObject) => {
    const API_URL = "https://www.egypt.gov.eg/mobile/Services/NTPMOJ-GG/functions/PayFines.aspx"
    const form = await fetch(API_URL)
    const formText = await form.text()
    const params = getFormParams(formText)
    params["cSearch$PlateFormat"] =  PLATE_FORMAT.ALPHA_NUMERIC
    switch (driverLicenseDataObject.type) {
        case PLATE_FORMAT.ALPHA_NUMERIC:
            params["cSearch$txtPlateAlpaNum$txtFL"] = driverLicenseDataObject.firstLetter
            params["cSearch$txtPlateAlpaNum$txtSL"] = driverLicenseDataObject.secondLetter
            params["cSearch$txtPlateAlpaNum$txtTL"] = driverLicenseDataObject.thirdLetter
            params["cSearch$txtPlateAlpaNum$txtDg"] = driverLicenseDataObject.digits + ""
            break;
    }
    const formData = new FormData()
    for (var key in params)
        formData.append(key, params[key]);
    
    const options = {
        method: 'POST',
        headers: { referer: API_URL },
        body: formData
    }

    const fines = await fetch(API_URL, options)
    const finesText = await fines.text()
    return parseFines(finesText)
}