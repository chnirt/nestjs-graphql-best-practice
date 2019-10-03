import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import { createConnection, getMetadataArgsStorage } from 'typeorm'
import { LoggerService } from './config/logger/logger.service'
// import { ValidationPipe } from './common/pipes/validation.pipe'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'
import config from './config.env'
import chalk from 'chalk'
// import * as fs from 'fs'

import { NODE_ENV, DOMAIN, PORT, END_POINT } from './environments'

const { orm } = config

declare const module: any

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		// httpsOptions: {
		// 	key: fs.readFileSync(`./ssl/product/server.key`),
		// 	cert: fs.readFileSync(`./ssl/product/server.crt`)
		// },
		logger: false
	})
	// COMPLETE: connect db
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

	// COMPLETE: for e2e testing
	const httpAdapter = app.getHttpAdapter()

	app.useLogger(app.get(LoggerService))

	// COMPLETE:
	app.useGlobalInterceptors(new LoggingInterceptor())
	app.useGlobalInterceptors(new TimeoutInterceptor())

	// COMPLETE:
	// app.useGlobalPipes(new ValidationPipe())

	app.enableShutdownHooks()

	await app.listen(PORT)

	// COMPLETE:
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}

	NODE_ENV !== 'production' &&
		Logger.log(
			`🚀  Server ready at http://${DOMAIN}:` +
				chalk.hex('#87e8de').bold(PORT) +
				`/${END_POINT}`,
			'Bootstrap'
		)

	NODE_ENV !== 'production' &&
		Logger.log(
			`🚀  Subscriptions ready at ws://${DOMAIN}:` +
				chalk.hex('#87e8de').bold(PORT) +
				`/${END_POINT}`,
			'Bootstrap'
		)
}
bootstrap()
