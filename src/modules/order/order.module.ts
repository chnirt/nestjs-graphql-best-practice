import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderResolver } from './order.resolver'
import { Order } from './order.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MenuModule } from '../menu/menu.module'

@Module({
	imports: [TypeOrmModule.forFeature([Order]), MenuModule],
	providers: [OrderService, OrderResolver]
})
export class OrderModule {}
