import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from './order.entity'
import { MongoRepository } from 'typeorm'
import { CreateOrderInput, UpdateOrderInput, DishInput } from '../../graphql'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: MongoRepository<Order>
  ) {}

  async create(input: CreateOrderInput): Promise<Order> {
    const { note, count, menuId, dishId, userId } = input
    const order = new Order()
    order.userId = userId
    order.menuId = menuId
    order.dishId = dishId
    order.note = note
    order.count = count
    console.log(order)
    return await this.orderRepository.save(order)
  }

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

  async update(_id: string, input: UpdateOrderInput): Promise<boolean> {
    const { note, count, menuId, dishId, userId, isConfirmed } = input
    const order = await this.orderRepository.findOne({ _id })

    if (!order) {
      throw Error.prototype.message
    }

    order.userId = userId
    order.menuId = menuId
    order.dishId = dishId
    order.note = note
    order.count = count
    order.isComfirmed = isConfirmed

    return (await this.orderRepository.save(order)) ? true : false
  }

  async updateDish(dishId: string, dishInput: DishInput): Promise<boolean> {
    const dish = await this.orderRepository.findOne({ dishId })
    const { name, count } = dishInput

    if (!dish) {
      throw Error.prototype.message
    }

    // dish.name = name
    dish.count = count

    return (await this.orderRepository.save(dish)) ? true : false
  }

  async delete(_id: string): Promise<boolean> {
    const order = await this.orderRepository.findOne({ _id })

    if (!order) {
      throw Error.prototype.message
    }

    return (await this.orderRepository.remove(order)) ? true : false
  }

  async deleteAll(): Promise<boolean> {
    return (await this.orderRepository.deleteMany({})) ? true : false
  }
}
