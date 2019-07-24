import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import helmet from 'helmet'
import csurf from 'csurf'
import rateLimit from 'express-rate-limit'
import logger from 'morgan'
import compression from 'compression'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ValidationPipe } from './common/pipes/validation.pipe'

import { LoggerService } from '@nestjs/common'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

import config from './config.env'

export class MyLogger implements LoggerService {
	log(message: string) {
		// console.log(message)
	}
	error(message: string, trace: string) {
		console.log('error', message, trace)
	}
	warn(message: string) {
		console.log('warn', message)
	}
	debug(message: string) {
		// console.log(message)
	}
	verbose(message: string) {
		// console.log(message)
	}
}

declare const module: any

const port = config.port
const domain = 'devcloud3.digihcs.com'
const end_point = config.end_point

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: true,
		// DONE:
		logger: new MyLogger()
	})

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

	app.use('/voyager', voyagerMiddleware({ endpointUrl: `/${end_point}` }))

	// DONE:
	app.useGlobalInterceptors(new LoggingInterceptor())

	// TODO: not working
	/* App filters. */
	// app.useGlobalFilters(new HttpExceptionFilter())
	/* End of app filters. */

	// DONE:
	app.useGlobalPipes(new ValidationPipe())

	await app.listen(port)

	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}

	Logger.log(
		`🚀 Server ready at http://${domain}:${port}/${end_point}`,
		'Bootstrap'
	)
	Logger.log(
		`🚀 Subscriptions ready at ws://${domain}:${port}/${end_point}`,
		'Bootstrap'
	)
}
bootstrap()
