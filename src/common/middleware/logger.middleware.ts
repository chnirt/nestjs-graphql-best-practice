import { Logger } from '@nestjs/common'

export function LoggerMiddleware(req, res, next): any {
	Logger.debug(
		`💬  ${
			req.headers['user-agent']
				? req.headers['user-agent'].split(') ')[0]
				: req.headers
		})`,
		'Bootstrap',
		false
	)
	next()
}
