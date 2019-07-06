import { Module, Global, forwardRef } from '@nestjs/common'
import { UserPermissionResolver } from './userPermission.resolver'
import { UserPermissionService } from './userPermission.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserPermission } from './userPermission.entity'

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([UserPermission]),
		forwardRef(() => UserPermissionModule)
	],
	providers: [UserPermissionResolver, UserPermissionService],
	exports: [UserPermissionService]
})
export class UserPermissionModule {}
