import fetch from 'node-fetch'

export const getDriverLicenseData = async (image) => {
    const API_URL = "https://tranquil-stream-81171.herokuapp.com/car"

    const formData = new FormData()

    formData.append('image', image)

    const options = {
        method: 'POST',
        body: formData
    }

    const response = await fetch(API_URL, options)
    const responseJSON = await response.json()

    if (responseJSON.type === "success")
        return responseJSON.payload
    else
        throw new Error(responseJSON.message)
}