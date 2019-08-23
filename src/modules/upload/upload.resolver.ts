import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql'
import { File } from './upload.entity'
import { UseInterceptors, UploadedFile } from '@nestjs/common'
import { diskStorage } from 'multer'
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express'
import { extname } from 'path'
import { MongoRepository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Resolver('Upload')
export class UploadResolver {
	constructor(
		@InjectRepository(File)
		private readonly fileRepository: MongoRepository<File>
	) {}

	@Mutation('singleUpload')
	@UseInterceptors(
		AnyFilesInterceptor({
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, cb) => {
					// Generating a 32 random chars long string
					const randomName = Array(32)
						.fill(null)
						.map(() => Math.round(Math.random() * 16).toString(16))
						.join('')
					//Calling the callback passing the random name generated with the original extension name
					cb(null, `${randomName}${extname(file.filename)}`)
				}
			})
		})
	)
	async singleUpload(@UploadedFile('file') file, @Context('req') req) {
		console.log(file)
		return 'nice'
	}

	@Query(() => [File])
	async files() {
		return await this.fileRepository.find()
	}
}
