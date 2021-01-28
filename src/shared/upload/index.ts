import * as cloudinary from 'cloudinary'

import {
	CLOUDINARY_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET
} from '@environments'

/**
 * Returns image url by upload file.
 *
 * @remarks
 * This method is part of the {@link shared/upload}.
 *
 * @param file - 1st input
 *
 * @returns The string mean of `createReadStream`
 *
 * @beta
 */
export const uploadFile = async (file: any): Promise<string> => {
	cloudinary.v2.config({
		cloud_name: CLOUDINARY_NAME,
		api_key: CLOUDINARY_API_KEY,
		api_secret: CLOUDINARY_API_SECRET
	})

	const uniqueFilename = new Date().toISOString()

	const result = await new Promise(async (resolve, reject) =>
		file
			.createReadStream()
			.pipe(
				cloudinary.v2.uploader.upload_stream(
					{
						folder: 'chnirt',
						public_id: uniqueFilename,
						tags: 'chnirt'
					}, // directory and tags are optional
					(err, image) => {
						if (err) {
							reject(err)
						}
						resolve(image)
					}
				)
			)
			.on('close', () => {
				resolve(true)
			})
			.on('error', () => reject(false))
	)

	return result['secure_url']
}
