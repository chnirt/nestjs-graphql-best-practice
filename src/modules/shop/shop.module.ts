import { Module } from '@nestjs/common'
import { ShopService } from './shop.service'
import { ShopResolver } from './shop.resolver'
import { CommonService } from '../common/services/common.service'

@Module({
  providers: [ShopService, ShopResolver, CommonService],
  exports: [ShopService]
})
export class ShopModule {}
