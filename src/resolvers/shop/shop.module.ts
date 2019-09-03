import { Module } from '@nestjs/common'
import { ShopResolver } from './shop.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Shop } from '../../models/shop.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Shop])],
	providers: [ShopResolver]
})
export class ShopModule {}
