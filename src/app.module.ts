import { Module, CacheModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { WinstonModule } from 'nest-winston'
import { GraphqlService } from './config/graphql/graphql.service'
import { TypeormService } from './config/typeorm/typeorm.service'
import { CacheService } from './config/cache/cache.service'
import { LoggerModule } from './config/logger/logger.module'
import { UserModule } from './resolvers/user/user.module'
import { PermissionModule } from './resolvers/permission/permission.module'
import { UserPermissionModule } from './resolvers/userPermission/userPermission.module'
import { SiteModule } from './resolvers/site/site.module'
import { ShopModule } from './resolvers/shop/shop.module'
import { SiteShopModule } from './resolvers/siteShop/siteShop.module'
import { DishModule } from './resolvers/dish/dish.module'
import { MenuModule } from './resolvers/menu/menu.module'
import { HistoryModule } from './resolvers/history/history.module'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { OrderModule } from './resolvers/order/order.module'
import { DateScalar } from './common/scalars/date.scalar'
import { UploadScalar } from './common/scalars/upload.scalar'
import { UploadModule } from './utils/upload/upload.module'
import { AuthModule } from './auth/auth.module'
import { MailModule } from './utils/mail/mail.module'
import { FileModule } from './resolvers/file/file.module'
import { DashboardModule } from './resolvers/dashboard/dashboard.module'
import * as winston from 'winston'
import * as helmet from 'helmet'
import * as compression from 'compression'
import * as csurf from 'csurf'
import * as rateLimit from 'express-rate-limit'
// import config from './config.env'

const {
	combine,
	json,
	timestamp,
	label,
	printf,
	prettyPrint,
	colorize
} = winston.format

// const { end_point } = config

@Module({
	imports: [
		GraphQLModule.forRootAsync({
			imports: [AuthModule],
			useClass: GraphqlService
		}),
		TypeOrmModule.forRootAsync({
			useClass: TypeormService
		}),
		CacheModule.registerAsync({
			useClass: CacheService
		}),
		WinstonModule.forRootAsync({
			useFactory: () => ({
				// options
				format: combine(
					label({ label: '🥢 Lunchapp4!' }),
					json(),
					timestamp(),
					// prettyPrint(),
					// colorize(),
					printf(({ level, message, label, timestamp }) => {
						console.log(level)
						return `{\n\tlabel: ${label},\n\ttimestamp: ${timestamp},\n\tlevel: ${level},\n\tmessage: ${message}\n},`
					})
				),
				transports: [
					new winston.transports.Console(),
					new winston.transports.File({
						filename: 'src/logs/combined.log',
						level: 'info'
					}),
					new winston.transports.File({
						filename: 'src/logs/errors.log',
						level: 'error'
					})
				],
				exceptionHandlers: [
					new winston.transports.Console(),
					new winston.transports.File({
						filename: 'src/logs/exceptions.log'
					})
				]
			}),
			inject: []
		}),
		UserModule,
		PermissionModule,
		UserPermissionModule,
		AuthModule,
		SiteModule,
		ShopModule,
		SiteShopModule,
		DishModule,
		MenuModule,
		HistoryModule,
		LoggerModule,
		OrderModule,
		MailModule,
		FileModule,
		UploadModule,
		DashboardModule
	],
	providers: [DateScalar, UploadScalar]
})

// COMPLETE:
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				helmet(),
				compression(),
				// csurf(),
				// rateLimit({
				// 	windowMs: 15 * 60 * 1000, // 15 minutes
				// 	max: 1, // limit each IP to 100 requests per windowMs
				// 	message:
				// 		'Too many request created from this IP, please try again after an hour'
				// }),
				process.env.NODE_ENV !== 'testing' && LoggerMiddleware
			)
			.forRoutes('/graphql')
	}
}
