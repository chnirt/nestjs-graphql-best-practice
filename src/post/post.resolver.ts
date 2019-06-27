import { Resolver, Query } from '@nestjs/graphql'

@Resolver('Post')
export class PostResolver {
	@Query(() => String)
	async test() {
		return await 'world'
	}
}
