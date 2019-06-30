import { Resolver, Query } from '@nestjs/graphql'

@Resolver('Site')
export class SiteResolver {
	@Query(() => String)
	async sites() {
		return 'hello'
	}
}
