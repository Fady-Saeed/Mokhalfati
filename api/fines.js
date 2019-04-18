const cheerio = require('cheerio')
const request = require('request-promise')

const getInputs = html => {
    const keys = ["__LASTFOCUS", "__EVENTTARGET", "__EVENTARGUMENT", "__VIEWSTATE", "__EVENTVALIDATION", "SenderID", "RandomSecret", "RequestObject", "HasedRequestObject", "cSearch$PlateFormat", "cSearch$txtPlateAlpaNum$txtFL", "cSearch$txtPlateAlpaNum$txtSL", "cSearch$txtPlateAlpaNum$txtTL", "cSearch$txtPlateAlpaNum$txtDg", "cSearch$txtPlateNum", "cSearch$btnSearch", "cSearch$ddlPlateType", "cSearch$ddlGovern"]
    const $ = cheerio.load(html)
    const inputs = {}
    $('input').each((i, ele) => {
        if (keys.indexOf($(ele).attr("name")) != -1)
            inputs[$(ele).attr("name")] = $(ele).val() || ""
    })
    return inputs
}

const parseFines = html => {
    const $ = cheerio.load(html)
    return $('#cFinesSummary_lblTotalNew').text()
}

export const getFines = async () => {
    const API_URL = "https://www.egypt.gov.eg/mobile/Services/NTPMOJ-GG/functions/PayFines.aspx"
    const form = await request.get(API_URL)
    const inputs = getInputs(form)
    inputs["cSearch$txtPlateAlpaNum$txtFL"] = 'ن'
    inputs["cSearch$txtPlateAlpaNum$txtSL"] = 'ط'
    inputs["cSearch$txtPlateAlpaNum$txtTL"] = 'ب'
    inputs["cSearch$txtPlateAlpaNum$txtDg"] = "648"
    inputs["cSearch$PlateFormat"] = "rdAlphaNum"
    const options = {
        url: API_URL,
        method: 'POST',
        headers: { referer: API_URL },
        form: inputs
    }
    const fines = await request(options)
    return parseFines(fines)
}