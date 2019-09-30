import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import { createConnection, getMetadataArgsStorage } from 'typeorm'
import { LoggerService } from './config/logger/logger.service'
import { ValidationPipe } from './common/pipes/validation.pipe'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'
import config from './config.env'
import chalk from 'chalk'

const { domain, port, end_point, orm } = config

createConnection({
	...orm,
	type: 'mongodb',
	entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
	synchronize: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	logging: true
})
	.then(cn => Logger.log(`☁️  Database connected`, 'TypeORM'))
	.catch(err => Logger.log(`❌  Database connect error, ${err}`, 'TypeORM'))

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
	process.env.NODE_ENV !== 'production' &&
		app.use(
			'/voyager',
			voyagerMiddleware({
				endpointUrl: `/${end_point}`
			})
		)

	// COMPLETE:
	app.useGlobalInterceptors(new LoggingInterceptor())
	app.useGlobalInterceptors(new TimeoutInterceptor())

	// COMPLETE:
	// app.useGlobalPipes(new ValidationPipe())

	app.enableShutdownHooks()

	await app.listen(port)

	// COMPLETE:
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}

	process.env.NODE_ENV !== 'production' &&
		Logger.log(
			`🚀  Server ready at http://${domain}:` +
				chalk.hex('#87e8de').bold(port) +
				`/${end_point}`,
			'Bootstrap'
		)

	process.env.NODE_ENV !== 'production' &&
		Logger.log(
			`🚀  Subscriptions ready at ws://${domain}:` +
				chalk.hex('#87e8de').bold(port) +
				`/${end_point}`,
			'Bootstrap'
		)
}
bootstrap()
