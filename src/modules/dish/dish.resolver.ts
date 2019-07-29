import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { DishService } from './dish.service'

@Resolver('Dish')
export class DishResolver {
  constructor(private readonly dishService: DishService) {}

  @Query('dish')
  async dish(@Args('id') id: string) {
    return await this.dishService.dish(id)
  }

  @Query('dishesByShop')
  async dishesByShop(@Args('shopId') shopId: string) {
    return await this.dishService.dishesByShop(shopId)
  }

  @Mutation('createDish')
  async createDish(@Args('name') name: string, @Args('shopId') shopId: string) {
    return await this.dishService.createDish(name, shopId)
  }

  @Mutation('deleteDish')
  async deleteDish(@Args('id') id: string) {
    return await this.dishService.deleteDish(id)
  }
}
