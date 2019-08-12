import { Module } from '@nestjs/common'
import { SiteShopResolver } from './siteShop.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SiteShop } from './siteShop.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SiteShop])],
  providers: [SiteShopResolver]
})
export class SiteShopModule {}
