import {
	Resolver,
	Query,
	Mutation,
	Args,
	Context,
	Subscription
} from '@nestjs/graphql'
import { Order } from './order.entity'
import { CreateOrderInput, UpdateOrderInput, OrderCount } from '../../graphql'
import { User } from '../user/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { ApolloError } from 'apollo-server-core'

@Resolver('Order')
export class OrderResolver {
	constructor(
		@InjectRepository(Order)
		private readonly orderRepository: MongoRepository<Order>
	) { }

	@Mutation(() => String)
	async orderDish(
		@Args('input') input: CreateOrderInput,
		@Context('currentUser') currentUser: User,
		@Context('pubSub') pubSub
	): Promise<string> {
		try {
			const userId = currentUser._id
			const { count, menuId, dishId } = input
			const order = await this.orderRepository.findOne({ userId, menuId, dishId })
			let orderId = ''
			if (order) {
				if (count > 0) {
					order.count = count
					await this.orderRepository.save(order)
					orderId = order._id
				} else {
					await this.orderRepository.deleteOne({ _id: order._id })
					orderId = order._id
				}
			} else {
				const newOrder = new Order()
				newOrder.userId = userId
				newOrder.menuId = menuId
				newOrder.dishId = dishId
				newOrder.count = count
				await this.orderRepository.save(newOrder).then(res => (orderId = res._id))
			}

			const ordersByMenu = await this.ordersCountByMenu(menuId)

			pubSub.publish('ordersByMenuCreated', { ordersByMenuCreated: ordersByMenu })

			return orderId
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Query(() => [Order])
	async orders(): Promise<Order[]> {
		try {
			return await this.orderRepository.find({ cache: true })
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Query(() => Order)
	async order(@Args('id') id: string): Promise<Order> {
		try {
			return await this.orderRepository.findOne({ _id: id })
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Query(() => Order)
	async currentOrder(@Args('menuId') menuId: string, @Args('dishId') dishId: string, @Context('currentUser') currentUser: User): Promise<Order> {
		try {
			return await this.orderRepository.findOne({ userId: currentUser._id, menuId, dishId })
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Query('ordersByUser')
	async ordersByUser(
		@Args('menuId') menuId: string,
		@Context('currentUser') currentUser: User
	): Promise<Order[]> {
		try {
			return await this.orderRepository.find({ userId: currentUser._id, menuId })
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Query('ordersByMenu')
	async ordersByMenu(@Args('menuId') menuId: string): Promise<Order[]> {
		try {
			return await this.orderRepository.find({ menuId })
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Query('ordersCountByMenu')
	async ordersCountByMenu(@Args('menuId') menuId: string): Promise<OrderCount[]> {
		try {
			const orders = await this.orderRepository.find({ menuId })
			let list = []
			await orders.map(order => {
				const index = list.findIndex(item => item._id === order.dishId)
				if (index === -1) {
					list.push({menuId: order.menuId, _id: order.dishId, count: order.count})
				} else {
					const obj = list[index]
					obj.count += order.count
					list = [...list.slice(0, index), obj, ...list.slice(index + 1)]
				}
			})
			return list
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation(() => Order)
	async updateOrder(
		@Args('input') input: UpdateOrderInput,
		@Args('id') id: string
	): Promise<boolean> {
		try {
			const { note, count } = input
			const order = await this.orderRepository.findOne({ _id: id })
			if (!order) {
				throw Error.prototype.message
			}
			order.note = note || ''
			order.count = count
			return (await this.orderRepository.save(order)) ? true : false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation(() => Boolean)
	async confirmOrder(@Args('orderIds') orderIds: string[]): Promise<boolean> {
		try {
			orderIds.map(async id => {
				const order = await this.orderRepository.findOne({ _id: id })
				order.isConfirmed = true
				await this.orderRepository.save(order).then().catch(() => false)
			})
			return true
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation(() => Boolean)
	async deleteOrder(@Args('id') id: string): Promise<boolean> {
		try {
			return await this.orderRepository.deleteOne({ _id: id }) ? true : false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Subscription()
	async ordersByMenuCreated(@Context('pubSub') pubSub: any) {
		return await pubSub.asyncIterator('ordersByMenuCreated')
	}
}
