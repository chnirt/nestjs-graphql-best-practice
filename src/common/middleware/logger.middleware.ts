import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import chalk from 'chalk'
import { createLogger, format, transports } from 'winston'

const { label, json, timestamp, printf } = format

const config = {
	levels: {
		error: 0,
		debug: 1,
		warn: 2,
		data: 3,
		info: 4,
		verbose: 5,
		silly: 6,
		custom: 7
	},
	colors: {
		error: 'red',
		debug: 'blue',
		warn: 'yellow',
		data: 'grey',
		info: 'green',
		verbose: 'cyan',
		silly: 'magenta',
		custom: 'yellow'
	}
}

const logger = createLogger({
	level: 'error',
	levels: config.levels,
	format: format.combine(
		label({ label: '🥢 Chnirt!' }),
		json(),
		timestamp(),
		// prettyPrint(),
		// colorize(),
		printf(({ level, message, label, timestamp }) => {
			console.log(level)
			return `{\n\tlabel: ${label},\n\ttimestamp: ${timestamp},\n\tlevel: ${level},\n\tmessage: ${message}\n},`
		})
	),
	defaultMeta: { service: 'user-service' },
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log`
		// - Write all logs error (and below) to `error.log`.
		//
		// new transports.Console(),
		new transports.File({
			filename: 'src/logs/error.log',
			level: 'error'
		}),
		new transports.File({
			filename: 'src/logs/info.log',
			level: 'info'
		})
		// new transports.File({ filename: 'src/logs/combined.log' })
	]
})

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	// tslint:disable-next-line:ban-types
	use(req: Request, res: Response, next: Function) {
		// console.log(req.headers['user-agent'])
		logger.info({ level: 'info', message: req.headers['user-agent'] })
		Logger.log(req.headers['user-agent'])
		console.log(
			'📢 ',
			chalk.hex('#69c0ff').bold('Request'),
			'»',
			new Date().toLocaleString()
		)
		next()
	}
}
