import {
	Resolver,
	Query,
	Args,
	Mutation,
	Subscription,
	Context
} from '@nestjs/graphql'
import { OrderJ, MenuOrderJ, OrderJInput } from './order-j.entity'
import { OrderJService } from './order-j.service'
import { User } from '../user/user.entity'

@Resolver('Order')
export class OrderJResolver {
	constructor(private readonly orderJService: OrderJService) {}

	@Query(() => [OrderJ!]!)
	async orderJs() {
		return await this.orderJService.findAll()
	}

	@Query(() => [OrderJ])
	async countByDishJ(@Args('dishId') dishId: string, @Args('menuId') menuId: string){
		return await this.orderJService.findByDish(dishId, menuId)
	}

	@Query(() => [OrderJ])
	async countByMenuJ(@Args('menuId') menuId: string){
		return await this.orderJService.findOrderByMenu(menuId)
	}

	@Query(() => MenuOrderJ!)
	async menuOrderJ(
		@Args('siteId') siteId: string,
		@Context('currentUser') currentUser: User
	) {
		return await this.orderJService.getMenuOrderJ(siteId, currentUser)
	}

	@Mutation(() => OrderJ)
	async updateOrderJ(@Args('input') input: OrderJInput, @Args('userId') userId: string){
		return await this.orderJService.updateOrderJ(input, userId)
	}

	@Mutation(() => OrderJ!)
	async orderJDish(
		@Args('input') input: OrderJInput,
		@Context('pubSub') pubSub,
		@Context('currentUser') currentUser: User
	) {
		const order = await this.orderJService.orderJDish(input, currentUser)

		const OrderQuantityNow = await this.orderJService.getOrderQuantityDish(
			input,
			currentUser._id,
			order.count
		)

		pubSub.publish('isUpdatedOrder', { isUpdatedOrder: OrderQuantityNow })
		return order
	}

	@Subscription()
	async isUpdatedOrder(@Context('pubSub') pubSub: any) {
		return await pubSub.asyncIterator('isUpdatedOrder')
	}
}
