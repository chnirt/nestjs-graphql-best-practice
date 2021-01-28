import { Injectable } from '@nestjs/common'
// import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule'

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!'
	}

	// @Cron('45 * * * * *')
	// handleCron() {
	// 	Logger.log('Called when the second is 45', 'Schedule')
	// }
	// @Interval(10000)
	// handleInterval() {
	// 	Logger.log('Called every 10 seconds', 'Schedule')
	// }
	// @Timeout(5000)
	// handleTimeout() {
	// 	Logger.log('Called once after 5 seconds', 'Schedule')
	// }
}
