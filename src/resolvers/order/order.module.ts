import { Module } from '@nestjs/common'
import { OrderResolver } from './order.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from '../../models/order.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Order])],
	providers: [OrderResolver]
})
export class OrderModule {}
