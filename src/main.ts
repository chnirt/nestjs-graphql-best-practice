import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import * as helmet from 'helmet'
import * as csurf from 'csurf'
import rateLimit from 'express-rate-limit'
import logger from 'morgan'
import * as compression from 'compression'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ValidationPipe } from './common/pipes/validation.pipe'
import { createConnection } from 'typeorm'
import { LoggerService } from './config/logger/logger.service'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

import config from './config.env'

createConnection(config.orm)
	.then(connection => Logger.log(`☁️  Database connected`, 'TypeORM'))
	.catch(error => Logger.log(`❌  Database connect error`, 'TypeORM'))

// PENDING:

declare const module: any

const domain = config.domain
const port = config.port
const end_point = config.end_point

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: true,
		logger: false
	})

	app.useLogger(app.get(LoggerService))

	// COMPLETE:
	app.use(helmet())
	// app.use(csurf())
	// app.use(
	// 	rateLimit({
	// 		windowMs: 15 * 60 * 1000, // 15 minutes
	// 		max: 1, // limit each IP to 100 requests per windowMs
	// 		message:
	// 			'Too many request created from this IP, please try again after an hour'
	// 	})
	// )

	// logger.token('graphql-logger', req => {
	// 	const { query, variables, operationName } = req.body
	// 	return `graphql-logger: \n
	// 	Query: ${query} \n
	// 	Variables: ${JSON.stringify(variables)}`
	// })
	// app.use(logger(':graphql-logger'))
	app.use(compression())

	// COMPLETE:
	if (process.env.NODE_ENV !== 'production') {
		app.use('/voyager', voyagerMiddleware({ endpointUrl: `/${end_point}` }))
	}

	// COMPLETE:
	app.useGlobalInterceptors(new LoggingInterceptor())

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
