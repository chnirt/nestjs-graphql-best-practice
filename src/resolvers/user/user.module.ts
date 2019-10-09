import { Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../models/user.entity'
import { AuthModule } from '../../auth/auth.module'
import { MailModule } from '../../shared/mail/mail.module'
import { ResultResolver } from './result.resolver'
import { UserResultResolver } from './userResult.resolver'

@Module({
	imports: [TypeOrmModule.forFeature([User]), AuthModule, MailModule],
	providers: [UserResolver, ResultResolver, UserResultResolver]
})
export class UserModule {}
