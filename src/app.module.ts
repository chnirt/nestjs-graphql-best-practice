import {
	Module,
	CacheModule,
	MiddlewareConsumer,
	OnModuleInit,
	Logger
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { WinstonModule } from 'nest-winston'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'

import { GraphqlService } from './config/graphql/graphql.service'
import { TypeormService } from './config/typeorm/typeorm.service'
import { CacheService } from './config/cache/cache.service'
import { LoggerModule } from './config/logger/logger.module'
import { UserModule } from './resolvers/user/user.module'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { DateScalar } from './common/scalars/date.scalar'
import { UploadScalar } from './common/scalars/upload.scalar'
import { UploadModule } from './utils/upload/upload.module'
import { AuthModule } from '@auth/auth.module'
import { MailModule } from './utils/mail/mail.module'
import { FileModule } from './resolvers/file/file.module'
import { TasksModule } from './utils/tasks/tasks.module'
import { TasksService } from './utils/tasks/tasks.service'

import * as bodyParser from 'body-parser'
// import * as winston from 'winston'
import * as helmet from 'helmet'
import * as compression from 'compression'
// import * as csurf from 'csurf'
// import * as rateLimit from 'express-rate-limit'

import { NODE_ENV, END_POINT, VOYAGER } from './environments'

// const {
// 	combine,
// 	json,
// 	timestamp,
// 	label,
// 	printf,
// 	prettyPrint,
// 	colorize
// } = winston.format

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
		// WinstonModule.forRootAsync({
		// 	useFactory: () => ({
		// 		// options
		// 		format: combine(
		// 			label({ label: '🥢 Chnirt!' }),
		// 			json(),
		// 			timestamp(),
		// 			// prettyPrint(),
		// 			// colorize(),
		// 			printf(({ level, message, label, timestamp }) => {
		// 				console.log(level)
		// 				return `{\n\tlabel: ${label},\n\ttimestamp: ${timestamp},\n\tlevel: ${level},\n\tmessage: ${message}\n},`
		// 			})
		// 		),
		// 		transports: [
		// 			new winston.transports.Console(),
		// 			new winston.transports.File({
		// 				filename: 'src/logs/combined.log',
		// 				level: 'info'
		// 			}),
		// 			new winston.transports.File({
		// 				filename: 'src/logs/errors.log',
		// 				level: 'error'
		// 			})
		// 		],
		// 		exceptionHandlers: [
		// 			new winston.transports.Console(),
		// 			new winston.transports.File({
		// 				filename: 'src/logs/exceptions.log'
		// 			})
		// 		]
		// 	}),
		// 	inject: []
		// }),
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
export class AppModule implements OnModuleInit {
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

		NODE_ENV !== 'production' &&
			consumer
				.apply(
					voyagerMiddleware({
						endpointUrl: `/${END_POINT}`
					})
				)
				.forRoutes(`/${VOYAGER}`)
	}

	onModuleInit() {
		this.tasksService.Cron()
	}
}
