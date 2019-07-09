import { Module } from '@nestjs/common'
import { OrderResolver } from './order.resolver'
import { OrderService } from './order.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from './order.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Order])],
	providers: [OrderResolver, OrderService]
})
export class OrderModule {}
