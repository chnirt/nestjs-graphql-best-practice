import { GOOGLE_APPLICATION_CREDENTIALS } from '../../environments'
import GoogleTranslate from 'google-translate'

// const googleTranslate = GoogleTranslate(GOOGLE_APPLICATION_CREDENTIALS)

const loremIpsum = 'I am using google translator to convert this text'

/**
 * Returns string by translate.
 *
 * @remarks
 * This method is part of the {@link shared/translate}.
 *
 * @param text - 1st input
 * @param code - 2nd input
 *
 * @returns The string mean of `text` and `code`
 *
 * @beta
 */
export const translate = async (
	text: string = loremIpsum,
	code = 'vi'
): Promise<string> =>
	new Promise((resolve, reject) => {
		// googleTranslate.translate(text, code, async (err, translation) => {
		// 	if (err) {
		// 		reject(err)
		// 	}
		// 	resolve(translation.translatedText)
		// })
	})
