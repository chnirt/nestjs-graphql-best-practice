import * as cloudinary from 'cloudinary'

import { CLOUD_NAME, API_KEY, API_SECRET } from '@environments'

/**
 * Returns image url by upload file.
 *
 * @remarks
 * This method is part of the {@link shared/upload}.
 *
 * @param createReadStream - 1st input number
 * @returns The string mean of `createReadStream`
 *
 * @beta
 */
export const uploadFile = async (createReadStream: any): Promise<string> => {
	cloudinary.config({
		cloud_name: CLOUD_NAME!,
		api_key: API_KEY!,
		api_secret: API_SECRET!,
	})

	const uniqueFilename = new Date().toISOString()

	const result = await new Promise(async (resolve, reject) =>
		createReadStream()
			.pipe(
				cloudinary.v2.uploader.upload_stream(
					{
						folder: 'chnirt',
						public_id: uniqueFilename,
						tags: `chnirt`,
					}, // directory and tags are optional
					(err, image) => {
						if (err) {
							reject(err)
						}
						resolve(image)
					},
				),
			)
			.on('close', () => {
				resolve(true)
			})
			.on('error', () => reject(false)),
	)
	return result['secure_url']
}
