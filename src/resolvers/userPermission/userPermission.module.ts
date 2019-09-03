import { Module } from '@nestjs/common'
import { UserPermissionResolver } from './userPermission.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserPermission } from '../../models/userPermission.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserPermission])],
	providers: [UserPermissionResolver],
	exports: [UserPermissionResolver]
})
export class UserPermissionModule {}
