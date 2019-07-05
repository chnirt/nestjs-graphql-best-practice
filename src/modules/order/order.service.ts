import { Injectable } from '@nestjs/common'
import { MongoRepository } from 'typeorm'
import { Order } from './order.entity'

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: MongoRepository<Order>) {}

  async findAdapter(
    findCondition?: any,
    orderCondition?: any,
    limit?: any
  ): Promise<any> {
    return await this.orderRepository.find({
      where: findCondition,
      order: orderCondition,
      take: limit
    })
  }

  async getOrders(): Promise<Order[]> {
    return this.orderRepository.find({ })
    return null
  }
}
