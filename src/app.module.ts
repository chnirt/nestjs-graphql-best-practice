import { Module, CacheModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'

import { GraphqlService } from './config/graphql/graphql.service'
import { TypeormService } from './config/typeorm/typeorm.service'
import { CacheService } from './config/cache/cache.service'
import { LoggerModule } from './config/logger/logger.module'
import { UserModule } from './resolvers/user/user.module'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { DateScalar } from './common/scalars/date.scalar'
import { UploadScalar } from './common/scalars/upload.scalar'
import { UploadModule } from './shared/upload/upload.module'
import { AuthModule } from '@auth/auth.module'
import { MailModule } from './shared/mail/mail.module'
import { FileModule } from './resolvers/file/file.module'
import { TasksModule } from './shared/tasks/tasks.module'
import { TasksService } from './shared/tasks/tasks.service'

import * as bodyParser from 'body-parser'
import * as helmet from 'helmet'
import * as compression from 'compression'
// import * as csurf from 'csurf'
// import * as rateLimit from 'express-rate-limit'

import { NODE_ENV, END_POINT } from './environments'

@Module({
	imports: [
		GraphQLModule.forRootAsync({
			imports: [AuthModule],
			useClass: GraphqlService
		}),
		TypeOrmModule.forRootAsync({
			imports: [AuthModule],
			useClass: TypeormService
		}),
		CacheModule.registerAsync({
			useClass: CacheService
		}),
		UserModule,
		AuthModule,
		LoggerModule,
		MailModule,
		FileModule,
		UploadModule,
		TasksModule
	],
	providers: [DateScalar, UploadScalar]
})

// COMPLETE:
export class AppModule {
	constructor(private readonly tasksService: TasksService) {}

	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				// bodyParser.json({ limit: '50mb' }),
				bodyParser.urlencoded({
					limit: '50mb',
					extended: true,
					parameterLimit: 50000
				}),
				helmet(),
				compression(),
				// csurf(),
				// rateLimit({
				// 	windowMs: 15 * 60 * 1000, // 15 minutes
				// 	max: 1, // limit each IP to 100 requests per windowMs
				// 	message:
				// 		'Too many request created from this IP, please try again after an hour'
				// }),
				NODE_ENV !== 'testing' && LoggerMiddleware
			)
			.forRoutes(`/${END_POINT}`)
	}
}
