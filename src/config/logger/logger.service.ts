import { Injectable, Logger } from '@nestjs/common'
// import * as winston from 'winston'

// COMPLETE:
@Injectable()
export class LoggerService extends Logger {
	log(level: string, message: string) {
		super.log(message)
		// winston.log(level, message)
	}
	error(message: string, trace: string) {
		super.error(message, trace)
		// winston.error(message)
	}
	warn(message: string) {
		super.warn(message)
		// winston.warn(message)
	}
	debug(message: string) {
		super.debug(message)
		// winston.debug(message)
	}
	verbose(message: string) {
		super.verbose(message)
		// winston.verbose(message)
	}
}
