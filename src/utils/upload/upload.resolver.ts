import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { createWriteStream } from 'fs'

@Resolver('Upload')
export class UploadResolver {
	@Mutation()
	async singleUpload(@Args('file') file: any) {
		const { filename, createReadStream } = await file

		return new Promise(async (resolve, reject) =>
			createReadStream()
				.pipe(createWriteStream(`photos/${filename}`))
				.on('finish', () => resolve(true))
				.on('error', () => reject(false))
		)
	}
}
