import { Injectable } from '@nestjs/common'
import { Logger } from '@nestjs/common'

// COMPLETE:
@Injectable()
export class LoggerService extends Logger {
	log(message: string) {
		super.log(message)
	}
	error(message: string, trace: string) {
		super.error(message, trace)
	}
	warn(message: string) {
		super.warn(message)
	}
	debug(message: string) {
		super.debug(message)
	}
	verbose(message: string) {
		super.verbose(message)
	}
}
