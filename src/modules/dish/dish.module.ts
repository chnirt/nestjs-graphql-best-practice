import { Module } from '@nestjs/common'
import { DishService } from './dish.service'
import { DishResolver } from './dish.resolver'
import { CommonService } from '../common/services/common.service'

@Module({
  providers: [DishService, DishResolver, CommonService]
})
export class DishModule {}
