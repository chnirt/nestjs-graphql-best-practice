import { Module, CacheModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'

import { GraphqlModule } from './graphql/graphql.module'
import { GraphqlService } from './graphql/graphql.service'
import { TypeormModule } from './typeorm/typeorm.module'
import { TypeormService } from './typeorm/typeorm.service'
import { CacheService } from './cache/cache.service'

import { UserModule } from './user/user.module'
import { EventsGateway } from './events/events.gateway'

@Module({
	imports: [
		GraphQLModule.forRootAsync({
			useClass: GraphqlService
		}),
		TypeOrmModule.forRootAsync({
			useClass: TypeormService
		}),
		CacheModule.registerAsync({
			useClass: CacheService
		}),
		UserModule,
		GraphqlModule,
		TypeormModule
		// AuthModule,
		// EventsModule,
	],
	providers: [EventsGateway]
})
export class AppModule {}
