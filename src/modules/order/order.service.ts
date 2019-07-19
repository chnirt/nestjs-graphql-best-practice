import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from './order.entity'
import { MongoRepository } from 'typeorm'
import { CreateOrderInput, UpdateOrderInput } from '../../graphql'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: MongoRepository<Order>
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      cache: true
    })
  }

  async findById(_id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ _id })

    if (!order) {
      throw Error.prototype.message
    }
    return order
  }

  async findCurrentOrder(userId: string, menuId: string, dishId: string): Promise<Order> {
    return await this.orderRepository.findOne({ userId, menuId, dishId })
  }

  async findOrdersByUser(userId: string, menuId: string) {
    return await this.orderRepository.find({ userId, menuId })
  }

  async findOrdersCountByUser(userId: string, menuId: string) {
    const orders = await this.orderRepository.find({ userId, menuId })
    return orders.map(order => ({menuId: order.menuId, dishId: order.dishId, count: order.count}))
  }

  async findOrdersByMenu(menuId: string) {
    return await this.orderRepository.find({ menuId })
  }

  async findOrdersCountByMenu(menuId: string) {
    const orders = await this.orderRepository.find({ menuId })
    let list = []
    await orders.map(order => {
      const index = list.findIndex(item => item.dishId === order.dishId)
      if (index === -1) {
        list.push({menuId: order.menuId, dishId: order.dishId, count: order.count})
      } else {
        const obj = list[index]
        obj.count += order.count
        list = [...list.slice(0, index), obj, ...list.slice(index + 1)]
      }
    })
    return list
  }

  async create(input: CreateOrderInput, userId: string): Promise<boolean> {
    const { note, count, menuId, dishId } = input
    const order = await this.findCurrentOrder(userId, menuId, dishId)
    if (order) {
      if (count > 0) {
        order.note = note || ''
        order.count = count
        return (await this.orderRepository.save(order)) ? true : false
      } else {
        return await this.orderRepository.deleteOne({_id: order._id}) ? true : false
      }
    } else {
      const newOrder = new Order()
      newOrder.userId = userId
      newOrder.menuId = menuId
      newOrder.dishId = dishId
      newOrder.note = note || ''
      newOrder.count = count
      return await this.orderRepository.save(newOrder) ? true : false
    }
  }

  async update(id: string, input: UpdateOrderInput): Promise<boolean> {
    const { note, count } = input
    const order = await this.findById(id)
    if (!order) {
      throw Error.prototype.message
    }
    order.note = note || ''
    order.count = count

    return (await this.orderRepository.save(order)) ? true : false
  }

  async confirm(orderIds: string[]): Promise<boolean> {
    orderIds.map(async id => {
      const order = await this.findById(id)
      order.isConfirmed = true
      await this.orderRepository.save(order).then().catch(error => false)
    })
    return true
  }

  async delete(_id: string): Promise<boolean> {
    // const order = await this.orderRepository.findOne({ _id })

    // if (!order) {
    //   throw Error.prototype.message
    // }

    // return (await this.orderRepository.remove(order)) ? true : false
    return await this.orderRepository.deleteOne({_id}) ? true : false
  }

  // async deleteAll(): Promise<boolean> {
  //   return (await this.orderRepository.deleteMany({})) ? true : false
  // }
}
