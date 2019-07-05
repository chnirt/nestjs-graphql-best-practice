import { Module } from '@nestjs/common'
import { UserPermissionResolver } from './userPermission.resolver'
import { UserPermissionService } from './userPermission.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserPermission } from './userPermission.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserPermission])],
	providers: [UserPermissionResolver, UserPermissionService]
})
export class UserPermissionModule {}
