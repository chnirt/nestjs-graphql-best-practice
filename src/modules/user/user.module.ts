import { Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UserPermissionModule } from '../userPermission/userPermission.module'
import { HistoryModule } from '../history/history.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		UserPermissionModule,
		HistoryModule
	],
	providers: [UserResolver]
})
export class UserModule {}
