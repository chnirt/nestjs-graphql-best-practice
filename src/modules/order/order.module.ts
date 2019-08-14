import { Module } from '@nestjs/common'
import { OrderResolver } from './order.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from './order.entity'
import { MenuModule } from '../menu/menu.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([Order])
		// MenuModule
	],
	providers: [OrderResolver]
})
export class OrderModule {}
