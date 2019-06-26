import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import * as dotenv from 'dotenv'
import helmet from 'helmet'
import csurf from 'csurf'
import { ValidationPipe } from './common/pipes/validation.pipe'

dotenv.config()
const port = process.env.PORT || 3000
declare const module: any

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
		{ cors: true }
	)
	// app.use(helmet())
	// app.use(csurf())
	app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }))
	app.useGlobalPipes(new ValidationPipe())
	await app.listen(port)

	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}

	Logger.log(`🚀 Server ready at http://localhost:${port}/graphql`, 'Bootstrap')
	Logger.log(
		`🚀 Subscriptions ready at ws://localhost:${port}/graphql`,
		'Bootstrap'
	)
}
bootstrap()
