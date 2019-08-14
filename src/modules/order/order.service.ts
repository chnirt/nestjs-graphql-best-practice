/*eslint-disable */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order, MenuOrder, OrderInput } from './order.entity'
import { MongoRepository, getMongoRepository } from 'typeorm'
import { User } from '../user/user.entity'
import { MenuResolver } from '../menu/menu.resolver'
import { Menu } from '../menu/menu.entity'
import { DishInfo } from 'src/graphql'
import { ApolloError } from 'apollo-server-core'
import * as uuid from 'uuid'

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order)
		private readonly orderRepository: MongoRepository<Order>
	) {}

	async findAll(): Promise<Order[]> {
		return await this.orderRepository.find()
	}

	async getMenuOrder(siteId: string, currentUser: User): Promise<MenuOrder> {
		const menu = await getMongoRepository(Menu).findOne({
			isPublished: true,
			siteId,
			isActive: true
		})

		const menuOrder = new MenuOrder()
		menuOrder.menuId = ''
		menuOrder.dishes = []

		if (!menu) {
			return menuOrder // không có menu nào public trên site này
		}

		menuOrder.menuId = menu._id
		menuOrder.dishes = []

		const listOrdersMenu = await this.orderRepository.find({
			menuId: menu._id
		}) // list chứa tất cả orders của mọi ng

		const res = (menu.dishes as DishInfo[]).map(dish => {
			const MyOrderQuantity = listOrdersMenu.reduce((total, order) => {
				if (order.userId === currentUser._id && order.dishId === dish._id) {
					return total + order.count
				}
				return total
			}, 0)

			const orderQuantityNow = listOrdersMenu.reduce((total, order) => {
				if (order.dishId === dish._id) {
					return total + order.count
				}
				return total
			}, 0)

			return {
				dishId: dish._id,
				name: dish.name,
				MyOrderQuantity,
				orderQuantityMax: dish.count,
				orderQuantityNow
			}
		})

		menuOrder.dishes = res
		return menuOrder
	}

	async getCountOrdersDishByMenuIdDishId(menuId, dishId): Promise<number> {
		const orders = await this.orderRepository.find({
			menuId,
			dishId
		})

		return orders.reduce((total, order) => {
			return total + order.count
		}, 0)
	}

	async orderDish(input: OrderInput, userCurrent: User): Promise<Order> {
		let order = await this.orderRepository.findOne({
			// tìm order này trong db
			userId: userCurrent._id,
			menuId: input.menuId,
			dishId: input.dishId
		})

		const countOld = order ? order.count : 0 // count đã order trước đó

		if (!order && input.count < 0) {
			// tạo mới và count = 0
			throw new ApolloError('Bạn không thể order 0 phần ăn!')
		}

		if (!order) {
			// chưa tạo trước đó thì tạo mới

			order = new Order()
			order._id = uuid.v1()
			order.userId = userCurrent._id
			order.menuId = input.menuId
			order.dishId = input.dishId
			order.count = input.count
			order.isConfirmed = false
			order.createdAt = new Date().toISOString()
			order.updatedAt = new Date().toISOString()
		}

		const menu = await getMongoRepository(Menu).findOne({
			_id: input.menuId,
			isActive: true
		})

		if (!menu) {
			throw new ApolloError('Không tìm thấy menu!', '404', {})
		}
		if (!menu.isPublished) {
			throw new ApolloError('Menu này không còn công khai!', '500', {})
		}

		const dish = menu.dishes.find(dish => dish._id === input.dishId) // thông tin món ăn hiện tại trong menu
		if (!dish) {
			throw new ApolloError('Không tìm thấy món ăn này trong menu!', '404', {})
		}

		const NumberOfOrderDishMax = dish.count
		const NumberOfOrdersDish = await this.getCountOrdersDishByMenuIdDishId(
			input.menuId,
			input.dishId
		)

		if (!(NumberOfOrderDishMax >= input.count - countOld + NumberOfOrdersDish)) {
			throw new ApolloError('Món ăn này không còn đủ để order!', '500', {})
		}

		order.count = input.count

		return await this.orderRepository.save(order)
	}
}

/*eslint-enable */
