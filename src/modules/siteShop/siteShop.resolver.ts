import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { SiteShopService } from './siteShop.service'
import { async } from 'rxjs/internal/scheduler/async';

@Resolver('siteShop')
export class SiteShopResolver {
  constructor(private readonly siteShopService: SiteShopService) {}

  @Query('siteShopsBySiteId')
  async getSiteShopsBySiteId(@Args('siteId') siteId: string) {
    return await this.siteShopService.getSiteShopsBySiteId(siteId)
  }

  @Mutation('createSiteShop')
  async createSiteShop(@Args('siteId') siteId: string, @Args('shopId') shopId: string) {
    return await this.siteShopService.createSiteShop(siteId, shopId)
  }
}
