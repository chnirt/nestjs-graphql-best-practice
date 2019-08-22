import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import { createConnection } from 'typeorm'

import { LoggerService } from './config/logger/logger.service'

import { ValidationPipe } from './common/pipes/validation.pipe'

import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'

import config from './config.env'

const { domain, port, end_point, orm } = config

createConnection(orm)
	.then(connection => Logger.log(`☁️  Database connected`, 'TypeORM'))
	.catch(error => Logger.log(`❌  Database connect error`, 'TypeORM'))

declare const module: any

const corsOptions = process.env.FE_URL
	? {
			origin: process.env.FE_URL
			// credentials: true // <-- REQUIRED backend setting
	  }
	: true

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: corsOptions,
		logger: false
	})

	// COMPLETE: for e2e testing
	const httpAdapter = app.getHttpAdapter()

	app.useLogger(app.get(LoggerService))

	// COMPLETE:
	if (process.env.NODE_ENV !== 'production') {
		app.use(
			'/voyager',
			voyagerMiddleware({
				endpointUrl: `/${end_point}`
			})
		)
	}

	// COMPLETE:
	app.useGlobalInterceptors(new LoggingInterceptor())
	app.useGlobalInterceptors(new TimeoutInterceptor())

	// COMPLETE:
	app.useGlobalPipes(new ValidationPipe())

	app.enableShutdownHooks()

	await app.listen(port)

	// COMPLETE:
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}

	Logger.log(
		`🚀  Server ready at http://${domain}:${port}/${end_point}`,
		'Bootstrap'
	)
	Logger.log(
		`🚀  Subscriptions ready at ws://${domain}:${port}/${end_point}`,
		'Bootstrap'
	)
}
bootstrap()
