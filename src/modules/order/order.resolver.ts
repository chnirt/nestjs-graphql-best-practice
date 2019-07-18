import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { Order } from './order.entity'
import { OrderService } from './order.service'
import { CreateOrderInput, UpdateOrderInput } from '../../graphql'
import { User } from '../user/user.entity';

@Resolver('Order')
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Boolean)
  async orderDish(@Args('input') input: CreateOrderInput, @Context('currentUser') currentUser: User) {
    return await this.orderService.create(input, currentUser._id)
  }

  @Query(() => [Order])
  async orders() {
    return await this.orderService.findAll()
  }

  @Query(() => Order)
  async order(@Args('id') id: string) {
    return await this.orderService.findById(id)
  }

  // @Query(() => Order)
  // async orderCurrentOfUser(@Args('menuId') menuId: string, @Args('dishId') dishId: string, @Context('currentUser') currentUser: User) {
  //   return await this.orderService.findCurrentOrder(currentUser._id, menuId, dishId)
  // }

  @Query('ordersByUser')
  async ordersByUser(@Args('menuId') menuId: string, @Context('currentUser') currentUser: User) {
    return await this.orderService.findOrdersByUser(currentUser._id, menuId)
  }

  @Query('ordersByMenu')
  async ordersByMenu(@Args('menuId') menuId: string) {
    return await this.orderService.findOrdersByMenu(menuId)
  }

  @Mutation(() => Order)
  async updateOrder(@Args('input') input: UpdateOrderInput, @Args('id') id: string) {
    return await this.orderService.update(id, input)
  }

  @Mutation(() => Boolean)
  async confirmOrder(@Args('orderIds') orderIds: string[]) {
    return await this.orderService.confirm(orderIds)
  }

  @Mutation(() => Boolean)
  async deleteOrder(@Args('id') id: string) {
    return await this.orderService.delete(id)
  }

  // @Mutation(() => Boolean)
  // async deleteOrders() {
  //   return await this.orderService.deleteAll()
  // }
}
