import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { Order } from './order.entity'
import { OrderService } from './order.service'
import { CreateOrderInput, UpdateOrderInput } from '../../graphql'

@Resolver('Order')
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  async createOrder(@Args('input') input: CreateOrderInput) {
    return await this.orderService.create(input)
  }

  @Query(() =>[Order])
  async orders() {
    return await this.orderService.findAll()
  }

  @Query(() => Order)
  async order(@Args('id') id: string) {
    return await this.orderService.findById(id)
  }

  @Mutation(() => Boolean)
  async deleteOrder(@Args('id') id: string) {
    return await this.orderService.delete(id)
  }

  @Mutation(() => Boolean)
  async deleteOrders() {
    return await this.orderService.deleteAll()
  }

  @Mutation(() => Order)
  async updateOrder(@Args('_id') _id: string, @Args('input') input: UpdateOrderInput) {
    return await this.orderService.update(_id, input)
  }
}
