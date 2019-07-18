import { Module } from '@nestjs/common'
import { SiteShopService } from './siteShop.service'
import { SiteShopResolver } from './siteShop.resolver'
import { CommonService } from '../common/services/common.service';
import { ShopService } from '../shop/shop.service';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports: [ShopModule],
  providers: [SiteShopService, SiteShopResolver, CommonService, ShopService]
})
export class SiteShopModule {}
