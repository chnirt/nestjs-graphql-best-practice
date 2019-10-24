import { Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../models'

import { EmailModule } from '../email/email.module'
import { FileModule } from '../file/file.module'

import { ResultResolver } from './result.resolver'
import { UserResultResolver } from './userResult.resolver'
import { AuthResolver } from './auth.resolver'

@Module({
	imports: [TypeOrmModule.forFeature([User]), EmailModule, FileModule],
	providers: [UserResolver, ResultResolver, UserResultResolver, AuthResolver]
})
export class UserModule {}
