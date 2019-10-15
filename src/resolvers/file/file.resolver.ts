import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { File } from '../../models'
import { UploadService } from '../../shared/upload/upload.service'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'

@Resolver('File')
export class FileResolver {
	constructor(
		@InjectRepository(File)
		private readonly fileRepository: MongoRepository<File>,
		private readonly uploadService: UploadService
	) {}

	@Query(() => [File])
	async files(): Promise<File[]> {
		return this.fileRepository.find({
			cache: true
		})
	}

	@Mutation(() => Boolean)
	async uploadFile(@Args('file') file: any): Promise<boolean> {
		const { filename, createReadStream } = file

		const path = await this.uploadService.uploadFile(createReadStream)

		return (await this.fileRepository.save(new File({ filename, path })))
			? true
			: false
	}
}
