import fetch from 'node-fetch'

export const getDriverLicenseData = async (image) => {
<<<<<<< HEAD
    const API_URL = "https://tranquil-stream-81171.herokuapp.com/car"

=======
    const API_URL = "https://tranquil-stream-81171.herokuapp.com/driver"
    
>>>>>>> 59f8008f7a055e63873cfa576c415203a4dab8c2
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