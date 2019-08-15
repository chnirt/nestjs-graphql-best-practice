import { Module } from '@nestjs/common'
import { OrderJService } from './order-j.service'
import { OrderJResolver } from './order-j.resolver'
import { OrderJ } from './order-j.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MenuModule } from '../menu/menu.module'

@Module({
	imports: [TypeOrmModule.forFeature([OrderJ]), MenuModule],
	providers: [OrderJService, OrderJResolver]
})
export class OrderJModule {}
