import chalk from 'chalk'
import { logger } from '../wiston'

export function LoggerMiddleware(req, res, next) {
	logger.debug(`📢  ${req.headers['user-agent']}`)
	console.log(
		new Date().toLocaleString(),
		'📢  ',
		chalk.hex('#69c0ff').bold('Request'),
		'»'
	)
	next()
}
