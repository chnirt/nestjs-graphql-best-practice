import { Module } from '@nestjs/common'
import { GraphqlService } from './graphql.service'
import { AuthModule } from '../../auth/auth.module'

@Module({
	imports: [AuthModule],
	providers: [GraphqlService]
})
export class GraphqlModule {}
