import { Module } from '@nestjs/common'
import { GraphqlService } from './graphql.service'
// import { AuthModule } from '../../auth/auth.module'
// import { ConfigModule } from '../envConfig/config.module'

@Module({
	// imports: [AuthModule, ConfigModule],
	providers: [GraphqlService]
})
export class GraphqlModule {}
