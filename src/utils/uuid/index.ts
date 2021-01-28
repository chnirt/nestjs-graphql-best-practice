/**
 * Returns string by uuidv4.
 *
 * @remarks
 * This method is part of the {@link utils/uuid}.
 *
 * @returns The string
 *
 * @beta
 */
export const uuidv4 = (): string => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

/**
 * Returns string by generateUID.
 *
 * @remarks
 * This method is part of the {@link utils/uuid}.
 *
 * @returns The string
 *
 * @beta
 */
export const generateUID = (): string => {
	// I generate the UID from two parts here
	// to ensure the random number provide enough bits.
	const firstPart = (Math.random() * 46656) | 0
	const secondPart = (Math.random() * 46656) | 0
	const newFirstPart = ('000' + firstPart.toString(36)).slice(-3)
	const newSecondPart = ('000' + secondPart.toString(36)).slice(-3)
	return newFirstPart + newSecondPart
}

// console.log(uuidv4())
// console.log(generateUID())
