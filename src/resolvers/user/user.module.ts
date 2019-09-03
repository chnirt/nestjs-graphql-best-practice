import { Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../models/user.entity'
import { AuthModule } from '../../auth/auth.module'
import { MailModule } from '../../utils/mail/mail.module'
import { UserPermissionModule } from '../userPermission/userPermission.module'
import { HistoryModule } from '../history/history.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		AuthModule,
		MailModule,
		UserPermissionModule,
		HistoryModule
	],
	providers: [UserResolver]
})
export class UserModule {}
