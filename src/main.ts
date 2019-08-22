import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import { createConnection } from 'typeorm'

import { LoggerService } from './config/logger/logger.service'

import { ValidationPipe } from './common/pipes/validation.pipe'

import { ErrorsInterceptor } from './common/interceptors/exception.interceptor'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'

import { HttpExceptionFilter } from './common/filters/http-exception.filter'

import config from './config.env'

createConnection(config.orm)
	.then(connection => Logger.log(`☁️  Database connected`, 'TypeORM'))
	.catch(error => Logger.log(`❌  Database connect error`, 'TypeORM'))

declare const module: any

const domain = config.domain
const port = config.port
const end_point = config.end_point

const corsOptions = {
	// origin: 'http://localhost:11041',
	credentials: true // <-- REQUIRED backend setting
}

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
	// app.useGlobalInterceptors(new ErrorsInterceptor())
	app.useGlobalInterceptors(new LoggingInterceptor())
	app.useGlobalInterceptors(new TimeoutInterceptor())

	// PENDING:
	/* App filters. */
	// app.useGlobalFilters(new HttpExceptionFilter())
	/* End of app filters. */

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
