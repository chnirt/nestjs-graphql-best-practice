import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { createConnection, getMetadataArgsStorage } from 'typeorm'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
// import * as fs from 'fs'
import chalk from 'chalk'

import { LoggerService } from './config/logger/logger.service'
import { ValidationPipe } from './common/pipes/validation.pipe'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'
import { TasksModule } from './shared/tasks/tasks.module'
import { TasksService } from './shared/tasks/tasks.service'

import config from './config.orm'

import { NODE_ENV, DOMAIN, PORT, END_POINT } from './environments'

declare const module: any

async function bootstrap() {
	// COMPLETE: connect database
	createConnection({
		...config,
		type: 'mongodb',
		entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
		synchronize: true,
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
		.then(data => Logger.log(`☁️  Database connected`, 'TypeORM'))
		.catch(err => Logger.error(`❌  Database connect error, ${err}`, 'TypeORM'))

	const app = await NestFactory.create(AppModule, {
		// httpsOptions: {
		// 	key: fs.readFileSync(`./ssl/product/server.key`),
		// 	cert: fs.readFileSync(`./ssl/product/server.crt`)
		// },
		logger: false
		// logger: new LoggerService()
	})

	// Application context
	const tasksService = app
		.select(TasksModule)
		.get(TasksService, { strict: true })

	// COMPLETE: tasks
	// tasksService.Timeout()
	// tasksService.Interval()
	tasksService.Cron()

	// COMPLETE: for e2e testing
	const httpAdapter = app.getHttpAdapter()

	app.useLogger(app.get(LoggerService))

	// COMPLETE:
	process.env.NODE_ENV !== 'production' &&
		app.use(
			'/voyager',
			voyagerMiddleware({
				endpointUrl: `/${END_POINT!}`
			})
		)

	// COMPLETE:
	app.useGlobalInterceptors(new LoggingInterceptor())
	app.useGlobalInterceptors(new TimeoutInterceptor())

	// COMPLETE:
	app.useGlobalPipes(new ValidationPipe())

	app.enableShutdownHooks()

	await app.listen(PORT)

	// COMPLETE:
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}

	NODE_ENV !== 'production' &&
		Logger.log(
			`🚀  Server ready at http://${DOMAIN!}:` +
				chalk.hex('#87e8de').bold(`${PORT!}`) +
				`/${END_POINT!}`,
			'Bootstrap'
		)

	NODE_ENV !== 'production' &&
		Logger.log(
			`🚀  Subscriptions ready at ws://${DOMAIN!}:` +
				chalk.hex('#87e8de').bold(`${PORT!}`) +
				`/${END_POINT!}`,
			'Bootstrap'
		)
}
bootstrap()
