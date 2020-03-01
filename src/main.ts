import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as helmet from 'helmet'
// import * as csurf from 'csurf'
import * as rateLimit from 'express-rate-limit'
// import * as cookieParser from 'cookie-parser'
// import * as fs from 'fs'
import chalk from 'chalk'

import { MyLogger } from '@config'
import {
	ValidationPipe,
	LoggingInterceptor,
	TimeoutInterceptor,
	LoggerMiddleware
	// logger
} from '@common'
import { timeout, interval, cron } from '@shared'
import { EmailResolver } from './resolvers/email.resolver'
import '@validations'

import {
	NODE_ENV,
	PRIMARY_COLOR,
	DOMAIN,
	PORT,
	END_POINT,
	VOYAGER,
	RATE_LIMIT_MAX,
	STATIC
} from '@environments'
import { getConnection } from 'typeorm'

declare const module: any

async function bootstrap() {
	try {
		const app = await NestFactory.create<NestExpressApplication>(AppModule, {
			// httpsOptions: {
			// 	key: fs.readFileSync(`./ssl/product/server.key`),
			// 	cert: fs.readFileSync(`./ssl/product/server.crt`)
			// },
			logger: new MyLogger()
		})

		// NOTE: database connect
		const connection = getConnection('default')
		const { isConnected } = connection
		isConnected
			? Logger.log(`🌨️  Database connected`, 'TypeORM', false)
			: Logger.error(`❌  Database connect error`, '', 'TypeORM', false)

		// NOTE: tasks
		// timeout()
		// interval()
		cron()

		// NOTE: adapter for e2e testing
		const httpAdapter = app.getHttpAdapter()

		// NOTE: compression
		app.use(compression())

		// NOTE: added security
		app.use(helmet())

		// NOTE: body parser
		app.use(bodyParser.json({ limit: '50mb' }))
		app.use(
			bodyParser.urlencoded({
				limit: '50mb',
				extended: true,
				parameterLimit: 50000
			})
		)

		// NOTE: cruf
		// app.use(csurf())

		// NOTE: rateLimit
		app.use(
			rateLimit({
				windowMs: 1000 * 60 * 60, // an hour
				max: RATE_LIMIT_MAX!, // limit each IP to 100 requests per windowMs
				message:
					'⚠️  Too many request created from this IP, please try again after an hour'
			})
		)

		// NOTE:loggerMiddleware
		NODE_ENV !== 'testing' && app.use(LoggerMiddleware)

		// NOTE: voyager
		process.env.NODE_ENV !== 'production' &&
			app.use(
				`/${VOYAGER!}`,
				voyagerMiddleware({
					displayOptions: {
						skipRelay: false,
						skipDeprecated: false
					},
					endpointUrl: `/${END_POINT!}`
				})
			)

		// NOTE: interceptors
		app.useGlobalInterceptors(new LoggingInterceptor())
		app.useGlobalInterceptors(new TimeoutInterceptor())

		// NOTE: global nest setup
		app.useGlobalPipes(new ValidationPipe())

		app.enableShutdownHooks()

		// NOTE: application context
		// const emailResolver = app
		// 	.select(EmailModule)
		// 	.get(EmailResolver, { strict: true })

		const emailResolver = app.get(EmailResolver)

		// NOTE: mail tracking
		app.use(`/${END_POINT}/:id`, (req, res, next) => {
			const { id } = req.params
			// console.log(req)

			if (id) {
				emailResolver.openEmail(id)
			}

			next()
		})

		// NOTE: size limit
		app.use('*', (req, res, next) => {
			const query = req.query.query || req.body.query || ''
			if (query.length > 2000) {
				throw new Error('Query too large')
			}
			next()
		})

		// NOTE: serve static
		app.useStaticAssets(join(__dirname, `../${STATIC}`))

		const server = await app.listen(PORT!)

		// NOTE: hot module replacement
		if (module.hot) {
			module.hot.accept()
			module.hot.dispose(() => app.close())
		}

		NODE_ENV !== 'production'
			? Logger.log(
					`🚀  Server ready at http://${DOMAIN!}:${chalk
						.hex(PRIMARY_COLOR!)
						.bold(`${PORT!}`)}/${END_POINT!}`,
					'Bootstrap',
					false
			  )
			: Logger.log(
					`🚀  Server is listening on port ${chalk
						.hex(PRIMARY_COLOR!)
						.bold(`${PORT!}`)}`,
					'Bootstrap',
					false
			  )

		NODE_ENV !== 'production' &&
			Logger.log(
				`🚀  Subscriptions ready at ws://${DOMAIN!}:${chalk
					.hex(PRIMARY_COLOR!)
					.bold(`${PORT!}`)}/${END_POINT!}`,
				'Bootstrap',
				false
			)
	} catch (error) {
		// logger.error(error)
		Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false)
		process.exit()
	}
}
bootstrap().catch(e => {
	Logger.error(`❌  Error starting server, ${e}`, '', 'Bootstrap', false)
	throw e
})
