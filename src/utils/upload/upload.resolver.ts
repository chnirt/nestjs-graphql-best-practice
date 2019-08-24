import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { createWriteStream } from 'fs'
import { MongoRepository } from 'typeorm'
import { File } from './upload.entity'
import { InjectRepository } from '@nestjs/typeorm'
import * as path from 'path'

@Resolver('Upload')
export class UploadResolver {
	constructor(
		@InjectRepository(File)
		private readonly uploadRepository: MongoRepository<File>
	) {}

	@Mutation(() => Boolean)
	async singleUpload(@Args('file') file) {
		const { filename, createReadStream } = file
		return new Promise(async (resolve, reject) =>
			createReadStream()
				.pipe(
					createWriteStream(path.join(__dirname, '/../../../images/', filename))
				)
				.on('close', () => {
					// const newFile = new File()
					// newFile.filename = filename
					// newFile.path = `uploads/${filename}`
					// this.uploadRepository.save(newFile)
					resolve(true)
				})
				.on('error', () => reject(false))
		)
	}
}
