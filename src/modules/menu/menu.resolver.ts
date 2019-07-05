import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { MenuService } from './menu.service'
import { MenuInfo, DishInput } from '../../graphql'
import { async } from 'rxjs/internal/scheduler/async';

@Resolver('Menu')
export class MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @Query('getMenus')
  async getMenus() {
    return await this.menuService.getMenus()
  }

  @Query('getMenu')
  async getMenu(@Args('id') id: string) {
    return await this.menuService.getMenu(id)
  }

  @Query('getMenuPublishBySite')
  async getMenuPublishBySite(@Args('currentSiteId') currentSiteId: string) {
    return await this.menuService.getMenuPublishBySite(currentSiteId)
  }

  @Mutation('createMenu')
  async createMenu(@Args('menuInfo') menuInfo: MenuInfo) {
    return await this.menuService.createMenu(menuInfo)
  }

  @Mutation('updateMenu')
  async updateMenu(@Args('id') id: string, @Args('menuInfo') menuInfo: MenuInfo) {
    return await this.menuService.updateMenu(id, menuInfo)
  }

  @Mutation('addDish')
  async addDish(@Args('id') id: string, @Args('dishInput') dishInput: DishInput) {
    return await this.menuService.addDish(id, dishInput)
  }

  @Mutation('updateDish')
  async updateDish(@Args('menuId') menuId: string, @Args('dishId') dishId: string, @Args('dishInput') dishInput: DishInput) {
    return await this.menuService.updateDish(menuId, dishId, dishInput)
  }

}
