import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../modules/user/user.entity'
import { GraphqlService } from './graphql.service'
import { UserService } from '../../modules/user/user.service'
import { UserModule } from '../../modules/user/user.module'

@Module({
	// imports: [TypeOrmModule.forFeature([User]), UserModule],
	providers: [GraphqlService]
})
export class GraphqlModule {}
