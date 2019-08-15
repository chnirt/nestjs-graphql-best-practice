import { Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UserPermissionModule } from '../userPermission/userPermission.module'

@Module({
	imports: [TypeOrmModule.forFeature([User]), UserPermissionModule],
	providers: [UserResolver]
})
export class UserModule {}
