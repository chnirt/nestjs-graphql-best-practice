import { Module } from '@nestjs/common'
import { MenuResolver } from './menu.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Menu } from './menu.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Menu])],
	providers: [MenuResolver]
})
export class MenuModule {}
