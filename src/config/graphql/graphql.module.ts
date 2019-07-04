import { Module } from '@nestjs/common'
import { GraphqlService } from './graphql.service'

@Module({
	providers: [GraphqlService]
})
export class GraphqlModule {}
