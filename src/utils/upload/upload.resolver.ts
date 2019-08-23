import { Resolver, Mutation, Args } from '@nestjs/graphql'

@Resolver('Upload')
export class UploadResolver {
	@Mutation()
	async singleUpload(@Args('file') file: any) {
		console.log(file)
		return 'nice'
	}
}
