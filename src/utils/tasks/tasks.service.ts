import { Injectable } from '@nestjs/common'
import { CronJob } from 'cron'
import { Logger } from '@nestjs/common'
import chalk from 'chalk'
import { ConfigService } from '../../config/envConfig/config.service'

@Injectable()
export class TasksService {
	constructor(private readonly configService: ConfigService) {}
	async Timeout() {
		const taskID = setTimeout(() => {
			process.env.NODE_ENV !== 'production' &&
				Logger.log(
					`🚀  Server ready at http://${this.configService.get('DOMAIN')}:` +
						chalk.hex('#87e8de').bold(this.configService.get('PORT')) +
						`/${this.configService.get('END_POINT')}`,
					'Bootstrap'
				)

			process.env.NODE_ENV !== 'production' &&
				Logger.log(
					`🚀  Subscriptions ready at ws://${this.configService.get(
						'DOMAIN'
					)}:` +
						chalk.hex('#87e8de').bold(this.configService.get('PORT')) +
						`/${this.configService.get('END_POINT')}`,
					'Bootstrap'
				)
			console.log('Task completed')
		}, 0)
		// clearTimeout(taskID);
	}

	async Interval() {
		const intervalID = setInterval(() => console.log('Task executed'), 2000)
		// clearInterval(intervalID);
	}

	async Cron() {
		const job = new CronJob({
			cronTime: '0 0 12 * * MON-FRI',
			onTick: () => {
				console.info('Cron job completed')
			},
			start: false,
			timeZone: 'Asia/Ho_Chi_Minh'
		})
		job.start()
	}
}
