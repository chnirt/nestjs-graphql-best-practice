import { Injectable } from '@nestjs/common'
import { MongoRepository } from 'typeorm'
import { Order } from './order.entity'
import { OrderInfo } from '../../graphql'
import { ApolloError } from 'apollo-server-core'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: MongoRepository<Order>
  ) {}

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
    return await this.findAdapter({}, {}, 1)
  }

  async createOrder(orderInfo: OrderInfo): Promise<boolean | ApolloError> {
    try {
      return (await this.orderRepository.save(new Order(orderInfo))) ? true : false
     } catch (error) {
      throw new ApolloError(error)
    }
  }
}
