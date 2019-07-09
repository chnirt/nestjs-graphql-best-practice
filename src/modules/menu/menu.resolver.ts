import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql'
import { MenuService } from './menu.service'
import { MenuInfo, DishInput } from '../../graphql'
import { async } from 'rxjs/internal/scheduler/async';

@Resolver('Menu')
export class MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @Query('Menus')
  async getMenus() {
    return await this.menuService.getMenus()
  }

  @Query('Menu')
  async getMenu(@Args('id') id: string) {
    return await this.menuService.getMenu(id)
  }

  @Query('MenuBySite')
  async getMenuBySite(@Context('currentsite') siteId: string) {
    return await this.menuService.getMenuBySite(siteId)
  }

  @Query('MenuPublishBySite')
  async getMenuPublishBySite(@Context('currentsite') currentSiteId: string) {
    return await this.menuService.getMenuPublishBySite(currentSiteId)
  }

  @Mutation('createMenu')
  async createMenu(@Args('menuInfo') menuInfo: MenuInfo, @Context('currentsite') siteId: string) {
    return await this.menuService.createMenu(menuInfo, siteId)
  }

  @Mutation('updateMenu')
  async updateMenu(@Args('id') id: string, @Args('menuInfo') menuInfo: MenuInfo) {
    return await this.menuService.updateMenu(id, menuInfo)
  }

  @Mutation('publishAndUnpublish')
  async publishAndUnpublish(@Args('id') id: string) {
    return await this.menuService.publishAndUnpublish(id)
  }

  @Mutation('lockAndUnlockMenu')
  async lockAndUnlockMenu(@Args('id') id: string) {
    return await this.menuService.lockAndUnlockMenu(id)
  }

  @Mutation('addDish')
  async addDish(@Args('id') id: string, @Args('dishInput') dishInput: DishInput) {
    return await this.menuService.addDish(id, dishInput)
  }

  @Mutation('updateDish')
  async updateDish(@Args('menuId') menuId: string, @Args('dishId') dishId: string, @Args('dishInput') dishInput: DishInput) {
    return await this.menuService.updateDish(menuId, dishId, dishInput)
  }

  @Mutation('closeMenu')
  async closeMenu(@Args('id') id: string) {
    return await this.menuService.closeMenu(id)
  }

}
