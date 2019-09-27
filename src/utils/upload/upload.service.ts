import { Injectable } from '@nestjs/common'
import * as cloudinary from 'cloudinary'

@Injectable()
export class UploadService {
	async uploadFile(createReadStream: any): Promise<string> {
		cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.API_KEY,
			api_secret: process.env.API_SECRET
		})

		const uniqueFilename = new Date().toISOString()

		const result = await new Promise(async (resolve, reject) =>
			createReadStream()
				.pipe(
					cloudinary.v2.uploader.upload_stream(
						{
							folder: 'acexis',
							public_id: uniqueFilename,
							tags: `acexis`
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
}
