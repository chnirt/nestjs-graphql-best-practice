import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { ShopService } from './shop.service'

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

}
