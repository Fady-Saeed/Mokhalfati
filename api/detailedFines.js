import cheerio from 'react-native-cheerio'
import fetch from 'node-fetch'
import {__VIEWSTATE, __EVENTVALIDATION} from './keys'

const getFormParams = html => {
    const keys = ["__LASTFOCUS", "__EVENTTARGET", "__EVENTARGUMENT", "__VIEWSTATE", "__VIEWSTATEGENERATOR", "__EVENTVALIDATION", "SenderID", "RandomSecret", "RequestObject", "HasedRequestObject"]//, "cConfirmOwner$txtIDNum", "cConfirmOwner$btnFineDetails"]
    const $ = cheerio.load(html)
    const params = {}
    $('input').each((i, ele) => {
        if (keys.indexOf($(ele).attr("name")) != -1)
            params[$(ele).attr("name")] =  $(ele).val() || ""
    })
    params["__VIEWSTATE"] = __VIEWSTATE
    params["__EVENTVALIDATION"] = __EVENTVALIDATION
    return params
}

const parseDetailedFines = html => {
    const details = {
        totalWithoutTaxes: -1,
        taxes: -1,
        detailedList: []
    }
    const $ = cheerio.load(html)
    const rows = $('#pnlCurFines #div_Res > center > table > tbody > tr').filter((i,tr) => {
        return $(tr).attr('valign') === "top"
    })
    const finesText = rows.map((i, tr) => {
        const td = $(tr).children('td')
        const tableInnerRowData = td.eq(4).find('td')
        if(i < rows.length - 2) {
            details.detailedList.push([
                tableInnerRowData.eq(0).text(), // Title
                td.eq(3).text(), // Location
                td.eq(2).text(), // Date
                +tableInnerRowData.eq(3).text(), // Amount
            ])
        } else {
            if(i === rows.length - 2)
                details.totalWithoutTaxes = +tableInnerRowData.find(".FineValue").eq(0).text()
            else if(i === rows.length -1 )
                details.taxes = +tableInnerRowData.find(".FineValue").eq(0).text()
        }
    })
    if(details.totalWithoutTaxes === -1 && details.taxes === -1 && details.detailedList.length === 0) {
        return {
            type: "error",
            message: "National ID Number doesn't match with the car owner's"
        }
    }
    details.type = "success"
    return details
}

export const getDetailedFines = async (driverLicenseDataObject) => {
    const API_URL = "https://www.egypt.gov.eg/mobile/Services/NTPMOJ-GG/functions/PayFines.aspx"
    const form = await fetch(API_URL)
    const formText = await form.text()
    const params = getFormParams(formText)
    
    const formData = new FormData()
    for (var key in params)
        formData.append(key, params[key]);
    
    formData.append("cConfirmOwner$btnFineDetails", "تفاصيل المخالفات")
    formData.append("cConfirmOwner$txtIDNum", driverLicenseDataObject.nationalID.trim())

    const options = {
        method: 'POST',
        headers: { referer: API_URL },
        body: formData
    }

    const detailedFinesPage = await fetch(API_URL, options)
    const detailedFinesText = await detailedFinesPage.text()
    const detailedFinesParsed = parseDetailedFines(detailedFinesText)
    if(detailedFinesParsed.type === "error") {
        throw new Error(detailedFinesParsed.message)
    }
    return detailedFinesParsed
}