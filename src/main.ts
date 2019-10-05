import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { createConnection, getMetadataArgsStorage } from 'typeorm'
import chalk from 'chalk'
import { LoggerService } from './config/logger/logger.service'
// import { ValidationPipe } from './common/pipes/validation.pipe'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'
// import fs from 'fs'
import config from './config.env'

import { NODE_ENV, DOMAIN, PORT, END_POINT } from './environments'
import { TasksModule } from '@utils/tasks/tasks.module'
import { TasksService } from '@utils/tasks/tasks.service'

declare const module: any

async function bootstrap() {
	// COMPLETE: connect db
	createConnection({
		...config.orm,
		type: 'mongodb',
		entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
		synchronize: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		logging: true
	})
		.then(cn => Logger.log(`☁️  Database connected`, 'TypeORM'))
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
	const tasksService = app.select(TasksModule).get(TasksService, { strict: true })

	// COMPLETE: tasks
	// tasksService.Timeout()
	// tasksService.Interval()
	tasksService.Cron()

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
			`🚀  Server ready at http://${DOMAIN}:` + chalk.hex('#87e8de').bold(PORT) + `/${END_POINT}`,
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
