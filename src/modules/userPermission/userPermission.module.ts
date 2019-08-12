import { Module, Global, forwardRef } from '@nestjs/common'
import { UserPermissionResolver } from './userPermission.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserPermission } from './userPermission.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserPermission])],
	providers: [UserPermissionResolver]
})
export class UserPermissionModule {}
