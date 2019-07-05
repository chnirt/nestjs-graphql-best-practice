import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from './order.entity'
import { MongoRepository } from 'typeorm'
import { CreateOrderInput, UpdateOrderInput } from '../../graphql'
import { NotBeforeError } from 'jsonwebtoken';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: MongoRepository<Order>
  ) {}

  async create(input: CreateOrderInput): Promise<Order> {
    const { note, count } = input
    const order = new Order()
    order.note = note
    order.count = count

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
    const { note, count } = input
    const order = await this.orderRepository.findOne({ _id })

    if (!order) {
      throw Error.prototype.message
    }

    order.note = note
    order.count = count

    return (await this.orderRepository.save(order)) ? true : false
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
