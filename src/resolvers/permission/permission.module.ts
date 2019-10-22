import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Permission } from '../../models'
import { PermissionResolver } from './permission.resolver'

@Module({
	imports: [TypeOrmModule.forFeature([Permission])],
	providers: [PermissionResolver]
})
export class PermissionModule {}
