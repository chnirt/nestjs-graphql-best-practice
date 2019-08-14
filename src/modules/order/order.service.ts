import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order, MenuOrder, OrderInput } from './order.entity'
import { MongoRepository } from 'typeorm'
import { CreateOrderInput, UpdateOrderInput } from '../../graphql'
import { ApolloError } from 'apollo-server-core'

import * as uuid from 'uuid'
import { User } from '../user/user.entity'
import { MenuResolver } from '../menu/menu.resolver'

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order)
		private readonly orderJRepository: MongoRepository<Order> // private readonly menuResolver: MenuResolver
	) {}

	async findAll(): Promise<Order[]> {
		return await this.orderJRepository.find()
	}

	// async getMenuOrder(siteId: string, currentUser: User): Promise<MenuOrder> {
	// 	const menu = await this.menuResolver.getMenuPublishBySite(siteId)
	// 	const menuOrder = new MenuOrder()
	// 	menuOrder.menuId = ''
	// 	menuOrder.dishes = []

	// 	if (!menu) {
	// 		return menuOrder // không có menu nào public trên site này
	// 	}

	// 	menuOrder.menuId = menu._id
	// 	menuOrder.dishes = []

	// 	const listOrdersMenu = await this.orderJRepository.find({
	// 		menuId: menu._id
	// 	}) // list chứa tất cả orders của mọi ng

	// 	// const res = menu.dishes.map(dish => {
	// 	// 	// duyệt qua menu

	// 	// 	const MyOrderQuantity = listOrdersMenu.reduce((total, order) => {
	// 	// 		if (order.userId === currentUser._id && order.dishId === dish._id) {
	// 	// 			return total + order.count
	// 	// 		}
	// 	// 		return total
	// 	// 	}, 0)

	// 	// 	const orderQuantityNow = listOrdersMenu.reduce((total, order) => {
	// 	// 		if (order.dishId === dish._id) {
	// 	// 			return total + order.count
	// 	// 		}
	// 	// 		return total
	// 	// 	}, 0)

	// 	// 	return {
	// 	// 		dishId: dish._id,
	// 	// 		name: dish.name,
	// 	// 		MyOrderQuantity,
	// 	// 		orderQuantityMax: dish.count,
	// 	// 		orderQuantityNow
	// 	// 	}
	// 	// })

	// 	menuOrder.dishes = [] //res
	// 	return menuOrder
	// }

	// async getCountOrdersDishByMenuIdDishId(menuId, dishId): Promise<number> {
	// 	const orders = await this.orderJRepository.find({
	// 		menuId,
	// 		dishId
	// 	})

	// 	return orders.reduce((total, order) => {
	// 		return total + order.count
	// 	}, 0)
	// }

	// async orderDishJ(input: OrderInput, userCurrent: User): Promise<Order> {
	// 	let order = await this.orderJRepository.findOne({
	// 		// tìm order này trong db
	// 		userId: userCurrent._id,
	// 		menuId: input.menuId,
	// 		dishId: input.dishId
	// 	})

	// 	const countOld = order ? order.count : 0 // count đã order trước đó

	// 	if (!order && input.count < 0) {
	// 		// tạo mới và count = 0
	// 		throw new ApolloError('Bạn không thể order 0 phần ăn!')
	// 	}

	// 	if (!order) {
	// 		// chưa tạo trước đó thì tạo mới

	// 		order = new Order()
	// 		order._id = uuid.v1()
	// 		order.userId = userCurrent._id
	// 		order.menuId = input.menuId
	// 		order.dishId = input.dishId
	// 		order.count = input.count
	// 		order.isConfirmed = false
	// 		order.createdAt = new Date().toISOString()
	// 		order.updatedAt = new Date().toISOString()
	// 	}

	// 	const menu = await this.menuResolver.getMenu(input.menuId)
	// 	if (!menu) {
	// 		throw new ApolloError('Không tìm thấy menu!', '404', {})
	// 	}
	// 	if (!menu.isPublished) {
	// 		throw new ApolloError('Menu này không còn công khai!', '500', {})
	// 	}

	// 	const dish = menu.dishes.find(dish => dish._id === input.dishId) // thông tin món ăn hiện tại trong menu
	// 	if (!dish) {
	// 		throw new ApolloError('Không tìm thấy món ăn này trong menu!', '404', {})
	// 	}

	// 	const NumberOfOrderDishMax = dish.count
	// 	const NumberOfOrdersDish = await this.getCountOrdersDishByMenuIdDishId(
	// 		input.menuId,
	// 		input.dishId
	// 	)

	// 	if (!(NumberOfOrderDishMax >= input.count - countOld + NumberOfOrdersDish)) {
	// 		throw new ApolloError('Món ăn này không còn đủ để order!', '500', {})
	// 	}

	// 	order.count = input.count

	// 	return await this.orderJRepository.save(order)
	// }
}

// @Injectable()
// export class OrderService {
//   constructor(
//     @InjectRepository(Order)
//     private readonly orderRepository: MongoRepository<Order>
//   ) {}

//   async findAll(): Promise<Order[]> {
//     return await this.orderRepository.find({
//       cache: true
//     })
//   }

//   async findById(_id: string): Promise<Order> {
//     const order = await this.orderRepository.findOne({ _id })

//     if (!order) {
//       throw Error.prototype.message
//     }
//     return order
//   }

//   async findCurrentOrder(userId: string, menuId: string, dishId: string): Promise<Order> {
//     return await this.orderRepository.findOne({ userId, menuId, dishId })
//   }

//   async findOrdersByUser(userId: string, menuId: string) {
//     return await this.orderRepository.find({ userId, menuId })
//   }

//   async findOrdersCountByUser(userId: string, menuId: string) {
//     const orders = await this.orderRepository.find({ userId, menuId })
//     return orders.map(order => ({menuId: order.menuId, dishId: order.dishId, count: order.count}))
//   }

//   async findOrdersByMenu(menuId: string) {
//     return await this.orderRepository.find({ menuId })
//   }

//   async findOrdersCountByMenu(menuId: string) {
//     const orders = await this.orderRepository.find({ menuId })
//     let list = []
//     await orders.map(order => {
//       const index = list.findIndex(item => item.dishId === order.dishId)
//       if (index === -1) {
//         list.push({menuId: order.menuId, dishId: order.dishId, count: order.count})
//       } else {
//         const obj = list[index]
//         obj.count += order.count
//         list = [...list.slice(0, index), obj, ...list.slice(index + 1)]
//       }
//     })
//     return list
//   }

//   async create(input: CreateOrderInput, userId: string): Promise<string> {
//     const { count, menuId, dishId } = input
//     const order = await this.findCurrentOrder(userId, menuId, dishId)
//     if (order) {
//       if (count > 0) {
//         order.count = count
//         await this.orderRepository.save(order)
//         return order._id
//       } else {
//         await this.orderRepository.deleteOne({_id: order._id})
//         return order._id
//       }
//     } else {
//       const newOrder = new Order()
//       newOrder.userId = userId
//       newOrder.menuId = menuId
//       newOrder.dishId = dishId
//       newOrder.count = count
//       return await this.orderRepository.save(newOrder).then(res => res._id)
//     }
//   }

//   async update(id: string, input: UpdateOrderInput): Promise<boolean> {
//     const { note, count } = input
//     const order = await this.findById(id)
//     if (!order) {
//       throw Error.prototype.message
//     }
//     order.note = note || ''
//     order.count = count

//     return (await this.orderRepository.save(order)) ? true : false
//   }

//   async confirm(orderIds: string[]): Promise<boolean> {
//     orderIds.map(async id => {
//       const order = await this.findById(id)
//       order.isConfirmed = true
//       await this.orderRepository.save(order).then().catch(error => false)
//     })
//     return true
//   }

//   async delete(_id: string): Promise<boolean> {
//     return await this.orderRepository.deleteOne({_id}) ? true : false
//   }

// }
