import { GOOGLE_APPLICATION_CREDENTIALS } from '../../environments'

const googleTranslate = require('google-translate')(
	GOOGLE_APPLICATION_CREDENTIALS
)

const loremIpsum = 'I am using google translator to convert this text'

export const translate = async (
	text: string = loremIpsum,
	code: string = 'vi'
): Promise<string> =>
	new Promise((resolve, reject) => {
		googleTranslate.translate(text, code, async (err, translation) => {
			if (err) {
				reject(err)
			}
			resolve(translation.translatedText)
		})
	})
