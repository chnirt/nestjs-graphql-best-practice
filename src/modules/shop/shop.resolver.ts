import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { ShopService } from './shop.service'
import { ShopInput } from '../../graphql'
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

  @Query('shopsBySite')
  async shopBySite(@Args('siteId') siteId: string) {
    return await this.shopService.getShopsBySite(siteId)
  }

  @Mutation('createShop')
  async createShop(@Args('input') input: ShopInput) {
    return await this.shopService.createShop(input)
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
}
