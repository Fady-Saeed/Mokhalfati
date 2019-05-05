import fetch from 'node-fetch'

export const getCarLicenseData = async (image) => {
    const API_URL = "https://tranquil-stream-81171.herokuapp.com/car"
    
    const formData = new FormData()
    
    formData.append('image', image)
    
    const options = {
        method: 'POST',
        body: formData
    }
    
    const response = await fetch(API_URL, options)
    const responseJSON = await response.json()

    if(responseJSON.type === "success") {
        responseJSON.payload.letters = responseJSON.payload.letters.map(lettersPlate => {
            return {
                firstLetter: lettersPlate[0],
                secondLetter: lettersPlate[1],
                thirdLetter: lettersPlate[2]
            }
        })
        
        const licensePlatesCombinations = []
        for(let ithLetters=0; ithLetters < responseJSON.payload.letters.length; ithLetters++) {
            for(let ithDigits=0; ithDigits < responseJSON.payload.digits.length; ithDigits++) {
                licensePlatesCombinations.push({
                    firstLetter: responseJSON.payload.letters[ithLetters].firstLetter,
                    secondLetter: responseJSON.payload.letters[ithLetters].secondLetter,
                    thirdLetter: responseJSON.payload.letters[ithLetters].thirdLetter,
                    digits: responseJSON.payload.digits[ithDigits]
                })
            }
        }
        return licensePlatesCombinations
    } else {
        throw new Error(responseJSON.message)
    }
}