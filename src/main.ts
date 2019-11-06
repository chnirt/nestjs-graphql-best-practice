import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import * as bodyParser from 'body-parser'
import * as helmet from 'helmet'
import * as compression from 'compression'
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
	DOMAIN,
	PORT,
	END_POINT,
	VOYAGER,
	RATE_LIMIT_MAX,
	STATIC
} from '@environments'

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

		// tasks
		// timeout()
		// interval()
		cron()

		// adapter for e2e testing
		const httpAdapter = app.getHttpAdapter()

		// added security
		app.use(helmet())

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
		app.use(compression())

		// cruf
		// app.use(csurf())

		// rateLimit
		app.use(
			rateLimit({
				windowMs: 1000 * 60 * 60, // an hour
				max: RATE_LIMIT_MAX!, // limit each IP to 100 requests per windowMs
				message:
					'Too many request created from this IP, please try again after an hour'
			})
		)

		// loggerMiddleware
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
		app.use(`/${END_POINT}/:id`, (req, res, next) => {
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

		// serve static
		app.useStaticAssets(join(__dirname, `../${STATIC}`))

		const server = await app.listen(PORT)

		// hot module replacement
		if (module.hot) {
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
		// logger.error(error)
		Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false)
		process.exit()
	}
}
bootstrap().catch(e => {
	throw e
})
