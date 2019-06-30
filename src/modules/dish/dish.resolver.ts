import { Resolver, Query } from '@nestjs/graphql'

@Resolver('Dish')
export class DishResolver {
	@Query(() => String)
	async dishes() {
		return 'hello'
	}
}
