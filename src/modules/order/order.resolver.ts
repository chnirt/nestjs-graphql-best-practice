import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { OrderService } from './order.service'
import { OrderInfo } from '../../graphql'

@Resolver('Order')
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query('getOrders')
  async getOrders() {
    return await this.orderService.getOrders()
  }

  @Mutation('createOrder')
  async createOrder(@Args('orderInfo') orderInfo: OrderInfo) {
    return await this.orderService.createOrder(orderInfo)
  }
}
