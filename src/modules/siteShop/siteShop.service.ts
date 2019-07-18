import { Injectable } from '@nestjs/common'
import { CommonService } from '../common/services/common.service'
import { SiteShop } from './siteShop.entity'
import { ShopService } from '../shop/shop.service'
import { ApolloError } from 'apollo-server-core';

@Injectable()
export class SiteShopService {
  constructor(
    private readonly commonService: CommonService,
    private readonly shopService: ShopService
  ) {}

  async getSiteShopsBySiteId(siteId: string) {
    try {
      const siteShops = await this.commonService.findAdapter(SiteShop, { siteId })
      const list = await siteShops.map(async siteShop => {
        const shop = await this.shopService.getShop(siteShop.shopId)
        return { shopId: siteShop.shopId, siteId: siteShop.siteId, name: shop.name }
      })
      return list
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  async createSiteShop(siteId: string, shopId: string) {
    try {
      return await this.commonService.createAdapter(SiteShop, { siteId, shopId }) ? true : false
    } catch (error) {
      throw new ApolloError(error)
    }
  }
}
