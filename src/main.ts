import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import * as dotenv from 'dotenv'
import helmet from 'helmet'
// import csurf from 'csurf'
import rateLimit from 'express-rate-limit'
import logger from 'morgan'
import { ValidationPipe } from './common/pipes/validation.pipe'

dotenv.config()
const port = process.env.PORT || 3000
declare const module: any

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true })

	// app.use(helmet())
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
