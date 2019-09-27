import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import chalk from 'chalk'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	// tslint:disable-next-line:ban-types
	use(req: Request, res: Response, next: Function) {
		console.log(
			'📢 ',
			chalk.hex('#69c0ff').bold('Request'),
			'»',
			new Date().toLocaleString()
		)
		next()
	}
}
