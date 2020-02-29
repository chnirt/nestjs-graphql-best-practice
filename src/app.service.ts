import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression, Interval } from '@nestjs/schedule'

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name)

	@Cron('45 * * * * *')
	handleCronCallSecond45() {
		this.logger.debug('Called when the current second is 45')
	}
	@Cron(CronExpression.EVERY_45_SECONDS)
	handleCronEvery45s() {
		this.logger.debug('Called every 45 seconds')
	}
	@Interval(10000)
	handleInterval() {
		this.logger.debug('Called every 10 seconds')
	}
}
