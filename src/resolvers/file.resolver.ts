import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { createWriteStream } from 'fs'
import { uuidv4 } from '@utils'

import { File } from '@entities'
import { uploadFile } from '@shared'
import { ApolloError } from 'apollo-server-core'

@Resolver('File')
export class FileResolver {
	@Query()
	async files(): Promise<File[]> {
		return getMongoRepository(File).find({
			cache: true
		})
	}

	@Mutation()
	async uploadFile(@Args('file') file: any): Promise<File> {
		const { filename } = file

		console.log(file)

		const path = await uploadFile(file)

		const newFile = await getMongoRepository(File).save(
			new File({ filename, path })
		)

		return newFile
	}

	@Mutation()
	async uploadFileLocal(
		@Args('file') file: any,
		@Context('req') req: any
	): Promise<any> {
		const { filename, createReadStream, mimetype } = file
		// console.log(req.headers.host)
		const convertFilename = `${uuidv4()}.${mimetype.split('/')[1]}`
		let path
		path = await new Promise(async (resolve, reject) =>
			createReadStream(file).pipe(
				createWriteStream(`./static/${convertFilename}`)
					.on('error', err => {
						console.log('Error upload ', err)

						reject(err)
					})
					.on('finish', async () => {
						// console.log(
						// 	'Link',
						// 	`${req.headers.host}/uploads/${convertFilename}`
						// )

						const link = `${req.headers.host}/static/${convertFilename}`

						resolve(link)
					})
			)
		)

		// console.log(path)

		const newFile = await getMongoRepository(File).save(
			new File({ filename, path })
		)

		return newFile
	}
}
