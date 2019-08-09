import { Module, forwardRef, Global } from '@nestjs/common'
import { PermissionResolver } from './permission.resolver'
import { PermissionService } from './permission.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Permission } from './permission.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Permission])],
	providers: [PermissionResolver, PermissionService]
})
export class PermissionModule {}
