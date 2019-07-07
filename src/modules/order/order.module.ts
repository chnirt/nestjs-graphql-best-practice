import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderResolver } from './order.resolver'
import { CommonService } from '../common/services/common.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from './order.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrderService, OrderResolver, CommonService]
})
export class OrderModule {}
