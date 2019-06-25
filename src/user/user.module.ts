import { Module, Global } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserResolver, UserService],
	exports: [UserService]
})
export class UserModule {}
