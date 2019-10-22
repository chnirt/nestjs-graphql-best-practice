import { Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../models'

import { AuthModule } from '../../auth/auth.module'
import { MailModule } from '../../shared/mail/mail.module'
import { EmailModule } from '../email/email.module'
import { FileModule } from '../file/file.module'

import { ResultResolver } from './result.resolver'
import { UserResultResolver } from './userResult.resolver'
import { FileResolver } from '../file/file.resolver'

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		AuthModule,
		MailModule,
		EmailModule,
		FileModule
	],
	providers: [UserResolver, ResultResolver, UserResultResolver, FileResolver]
})
export class UserModule {}
