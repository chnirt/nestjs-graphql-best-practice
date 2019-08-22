import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { UploadService } from './upload.service'
import { File } from './upload.entity'
import { UploadedFile } from '@nestjs/common'
import { Upload } from '../../common/scalars/upload.scalar'

@Resolver('Upload')
export class UploadResolver {
	constructor(private readonly uploadService: UploadService) {}

	@Mutation()
	async singleUpload(@Args('file') file: any) {
		console.log(file)
		return 'nice'
	}
}
