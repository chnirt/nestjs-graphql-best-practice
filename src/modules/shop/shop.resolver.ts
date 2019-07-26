import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { ShopService } from './shop.service'
import { async } from 'rxjs/internal/scheduler/async';

@Resolver('Shop')
export class ShopResolver {
  constructor(private readonly shopService: ShopService) {}

  @Query('shops')
  async shops() {
    return await this.shopService.getAllShops()
  }

  @Query('shop')
  async shop(@Args('id') id: string) {
    return await this.shopService.getShop(id)
  }

  @Mutation('createShop')
  async createShop(@Args('name') name: string) {
    return await this.shopService.createShop(name)
  }

  @Mutation('deleteShop')
  async deleteShop(@Args('id') id: string) {
    return await this.shopService.deleteShop(id)
  }

  @Mutation('addDish')
  async addDish(@Args('id') id: string, @Args('name') name: string) {
    return await this.shopService.addDish(id, name)
  }

  @Mutation('updateDish')
  async updateDish(@Args('id') id: string, @Args('dishId') dishId: string, @Args('name') name: string) {
    return await this.shopService.updateDish(id, dishId, name)
  }

  @Mutation('deleteDish')
  async deleteDish(@Args('id') id: string, @Args('dishId') dishId: string) {
    return await this.shopService.deleteDish(id, dishId)
  }
}
