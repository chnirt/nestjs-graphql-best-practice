import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { File } from '../../models'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'

import { uploadFile } from '../../shared/upload'

@Resolver('File')
export class FileResolver {
	constructor(
		@InjectRepository(File)
		private readonly fileRepository: MongoRepository<File>
	) {}

	@Query(() => [File])
	async files(): Promise<File[]> {
		return this.fileRepository.find({
			cache: true
		})
	}

	@Mutation(() => File)
	async uploadFile(@Args('file') file: any): Promise<File> {
		const { filename, createReadStream } = file

		const path = await uploadFile(createReadStream)

		const newFile = await this.fileRepository.save(new File({ filename, path }))

		return newFile
	}
}
