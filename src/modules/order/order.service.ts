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

  async findOrdersByMenu(menuId: string) {
    return await this.orderRepository.find({ menuId })
  }

  async create(input: CreateOrderInput, userId: string): Promise<boolean> {
    const { note, count, menuId, dishId } = input
    if (await this.findCurrentOrder(userId, menuId, dishId)) {
      const order = await this.findCurrentOrder(userId, menuId, dishId)
      order.note = note || ''
      order.count = count
      return (await this.orderRepository.save(order)) ? true : false
    } else {
      const order = new Order()
      order.userId = userId
      order.menuId = menuId
      order.dishId = dishId
      order.note = note || ''
      order.count = count
      return await this.orderRepository.save(order) ? true : false
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

  async confirm(userId: string, menuId: string, dishId: string): Promise<boolean> {
    const order = await this.findCurrentOrder(userId, menuId, dishId)

    if (!order) {
      throw Error.prototype.message
    }

    order.isConfirmed = true

    return (await this.orderRepository.save(order)) ? true : false
  }

  async delete(_id: string): Promise<boolean> {
    const order = await this.orderRepository.findOne({ _id })

    if (!order) {
      throw Error.prototype.message
    }

    return (await this.orderRepository.remove(order)) ? true : false
  }

  // async deleteAll(): Promise<boolean> {
  //   return (await this.orderRepository.deleteMany({})) ? true : false
  // }
}
