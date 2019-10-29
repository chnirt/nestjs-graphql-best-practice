import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'

import { File } from '../models'
import { uploadFile } from '../shared/upload'

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
		const { filename, createReadStream } = file

		const path = await uploadFile(createReadStream)

		const newFile = await getMongoRepository(File).save(
			new File({ filename, path })
		)

		return newFile
	}
}
