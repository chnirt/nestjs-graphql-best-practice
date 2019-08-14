import {
	Resolver,
	Query,
	Args,
	Mutation,
	Subscription,
	Context
} from '@nestjs/graphql'
import { Order, MenuOrder, OrderInput } from './order.entity'
import { OrderService } from './order.service'
import { User } from '../user/user.entity'

@Resolver('Order')
export class OrderResolver {
	constructor(private readonly orderService: OrderService) {}

	@Query(() => [Order!]!)
	async orders() {
		return await this.orderService.findAll()
	}

	@Query(() => MenuOrder!)
	async menuOrder(
		@Args('siteId') siteId: string,
		@Context('currentUser') currentUser: User
	) {
		console.log(siteId)
		return await this.orderService.getMenuOrder(siteId, currentUser)
	}

	@Mutation(() => Order!)
	async orderDish(
		@Args('input') input: OrderInput,
		@Context('pubSub') pubSub,
		@Context('currentUser') currentUser: User
	) {
		const order = await this.orderService.orderDish(input, currentUser)
		pubSub.publish('isUpdated', { isUpdated: true })
		return order
	}

	// @Subscription()
	// async isUpdated(@Context('pubSub') pubSub: any) {
	// 	return await pubSub.asyncIterator('isUpdated')
	// }
}
