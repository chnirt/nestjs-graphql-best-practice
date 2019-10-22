import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from '../../models'
import { RoleResolver } from './role.resolver'

@Module({
	imports: [TypeOrmModule.forFeature([Role])],
	providers: [RoleResolver]
})
export class RoleModule {}
