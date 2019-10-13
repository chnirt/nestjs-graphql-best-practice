import { addColors, createLogger, format, transports } from 'winston'

const { label, json, timestamp, align, printf } = format

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

const myFormat = printf(({ level, message, label, timestamp }) => {
	// console.log(level)
	return `{\n\tlabel: ${label},\n\ttimestamp: ${timestamp},\n\tlevel: ${level},\n\tmessage: ${message}\n},`
})

const logger = createLogger({
	level: 'error',
	levels: config.levels,
	format: format.combine(
		label({ label: '👻  Chnirt!' }),
		json(),
		timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		align(),
		// prettyPrint(),
		// colorize(),
		myFormat
	),
	defaultMeta: { service: 'user-service' },
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log`
		// - Write all logs error (and below) to `error.log`.
		//
		// new transports.Console(),
		new transports.File({
			filename: 'logs/info.log',
			level: 'info'
		}),
		new transports.File({
			filename: 'logs/error.log',
			level: 'error'
		}),
		new transports.File({
			filename: 'logs/warn.log',
			level: 'warn'
		}),
		new transports.File({
			filename: 'logs/debug.log',
			level: 'debug'
		}),
		new transports.File({
			filename: 'logs/verbose.log',
			level: 'verbose'
		})
		// new transports.File({ filename: 'src/logs/combined.log' })
	]
})

addColors(config.colors)

export { logger }
