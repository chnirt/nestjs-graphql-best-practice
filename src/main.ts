import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { createConnection, getMetadataArgsStorage } from 'typeorm'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import * as bodyParser from 'body-parser'
import * as helmet from 'helmet'
import * as compression from 'compression'
import * as passport from 'passport'
// import * as csurf from 'csurf'
// import * as rateLimit from 'express-rate-limit'
// import * as cookieParser from 'cookie-parser'
// import * as fs from 'fs'
import chalk from 'chalk'

import { LoggerService } from './config/logger/logger.service'
import { ValidationPipe } from './common/pipes/validation.pipe'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'
import { LoggerMiddleware } from './common/middleware/logger.middleware'

import { timeout, interval, cron } from './shared'

import { EmailResolver } from './resolvers/email.resolver'

import config from './config.orm'
import { logger } from './common/wiston'

import { NODE_ENV, DOMAIN, PORT, END_POINT, VOYAGER } from './environments'

declare const module: any

// connect database
createConnection({
	...config,
	type: 'mongodb',
	entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
	synchronize: true,
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(data => {
		logger.info(data)
		Logger.log(`☁️  Database connected`, 'TypeORM')
	})
	.catch(err => {
		logger.error(err)
		Logger.error(`❌  Database connect error, ${err}`, 'TypeORM')
	})

async function bootstrap() {
	try {
		const app = await NestFactory.create(AppModule, {
			// httpsOptions: {
			// 	key: fs.readFileSync(`./ssl/product/server.key`),
			// 	cert: fs.readFileSync(`./ssl/product/server.crt`)
			// },
			logger: false
		})

		// tasks
		// timeout()
		// interval()
		cron()

		// adapter for e2e testing
		const httpAdapter = app.getHttpAdapter()

		app.useLogger(app.get(LoggerService))

		// added security
		// app.use(helmet())

		// body parser
		app.use(bodyParser.json({ limit: '50mb' }))
		app.use(
			bodyParser.urlencoded({
				limit: '50mb',
				extended: true,
				parameterLimit: 50000
			})
		)

		// compress
		// app.use(compression())

		// cruf
		// app.use(csurf())

		// rateLimit
		// app.use(
		// 	rateLimit({
		// 		windowMs: 15 * 60 * 1000, // 15 minutes
		// 		max: 1, // limit each IP to 100 requests per windowMs
		// 		message:
		// 			'Too many request created from this IP, please try again after an hour'
		// 	})
		// )

		// poggerMiddleware
		NODE_ENV !== 'testing' && app.use(LoggerMiddleware)

		// voyager
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

		// interceptors
		app.useGlobalInterceptors(new LoggingInterceptor())
		app.useGlobalInterceptors(new TimeoutInterceptor())

		// global nest setup
		app.useGlobalPipes(new ValidationPipe())

		app.enableShutdownHooks()

		// application context
		// const emailResolver = app
		// 	.select(EmailModule)
		// 	.get(EmailResolver, { strict: true })

		const emailResolver = app.get(EmailResolver)

		// mail tracking
		app.use('/graphql/:id', (req, res, next) => {
			const { id } = req.params
			// console.log(req)

			if (id) {
				emailResolver.openEmail(id)
			}

			next()
		})

		// size limit
		app.use('*', (req, res, next) => {
			const query = req.query.query || req.body.query || ''
			if (query.length > 2000) {
				throw new Error('Query too large')
			}
			next()
		})

		const server = await app.listen(PORT)

		// hot module replacement
		if (module.hot) {
			module.hot.accept(async () => {
				try {
					server.removeAllListeners('request', server)

					const app = await NestFactory.create(AppModule, {
						// httpsOptions: {
						// 	key: fs.readFileSync(`./ssl/product/server.key`),
						// 	cert: fs.readFileSync(`./ssl/product/server.crt`)
						// },
						logger: false
					})

					// server.on(
					// 	'request',
					// 	app.useCallback(() => {
					// 		callback
					// 	}, [input])()
					// )
				} catch (err) {
					console.log(err)
				}
			})
			module.hot.accept()
			module.hot.dispose(() => app.close())
		}

		NODE_ENV !== 'production'
			? Logger.log(
					`🚀  Server ready at http://${DOMAIN!}:${chalk
						.hex('#87e8de')
						.bold(`${PORT!}`)}/${END_POINT!}`,
					'Bootstrap'
			  )
			: Logger.log(
					`🚀  Server is listening on port ${chalk
						.hex('#87e8de')
						.bold(`${PORT!}`)}`,
					'Bootstrap'
			  )

		NODE_ENV !== 'production' &&
			Logger.log(
				`🚀  Subscriptions ready at ws://${DOMAIN!}:${chalk
					.hex('#87e8de')
					.bold(`${PORT!}`)}/${END_POINT!}`,
				'Bootstrap'
			)
	} catch (error) {
		logger.error(error)
		Logger.error(`❌  Error starting server, ${error}`, 'Bootstrap')
		process.exit()
	}
}
bootstrap()
