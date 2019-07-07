import { Module, forwardRef, Global } from '@nestjs/common'
import { PermissionResolver } from './permission.resolver'
import { PermissionService } from './permission.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Permission } from './permission.entity'
import { UserPermissionModule } from '../userPermission/userPermission.module'

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([Permission]),
		forwardRef(() => UserPermissionModule)
	],
	providers: [PermissionResolver, PermissionService],
	exports: [PermissionService]
})
export class PermissionModule {}
