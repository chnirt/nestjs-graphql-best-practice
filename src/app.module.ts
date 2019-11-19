import { CacheModule, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CacheService, GraphqlService, TypeormService } from './config'
import { AppController } from './app.controller'
import { DateScalar } from './config/graphql/scalars/date.scalar'
import { UploadScalar } from './config/graphql/scalars/upload.scalar'

import * as Resolvers from './resolvers'

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
		})
	],
	controllers: [AppController],
	providers: [DateScalar, UploadScalar, ...Object.values(Resolvers)]
})
export class AppModule {}
