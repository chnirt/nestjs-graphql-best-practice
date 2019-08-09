import { Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { UserService } from '../../../../lunchapp-innos-backend/src/modules/user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserResolver, UserService]
})
export class UserModule {}
