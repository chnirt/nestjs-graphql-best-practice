import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/user.entity'
import { GraphqlService } from './graphql.service'
import { UserService } from '../user/user.service'
import { UserModule } from '../user/user.module'

@Module({
	// imports: [TypeOrmModule.forFeature([User]), UserModule],
	providers: [GraphqlService]
})
export class GraphqlModule {}
