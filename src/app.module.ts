import { CacheModule, Module, HttpModule } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
// import { BullModule } from '@nestjs/bull'

import {
	CacheService,
	GraphqlService,
	TypeOrmService
	// BullConfigService
} from './config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
// import { AppProcessor } from './app.processor'
import { DateScalar } from './config/graphql/scalars/date.scalar'
import { UploadScalar } from './config/graphql/scalars/upload.scalar'

import * as Resolvers from './resolvers'

@Module({
	imports: [
		ScheduleModule.forRoot(),
		GraphQLModule.forRootAsync({
			useClass: GraphqlService
		}),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmService
		}),
		CacheModule.registerAsync({
			useClass: CacheService
		}),
		// BullModule.registerQueueAsync({
		// 	name: 'app',
		// 	useClass: BullConfigService
		// }),
		HttpModule
	],
	controllers: [AppController],
	providers: [
		DateScalar,
		UploadScalar,
		...Object.values(Resolvers),
		AppService
		// AppProcessor
	]
})
export class AppModule {}
