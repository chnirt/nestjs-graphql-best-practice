import { Injectable } from '@nestjs/common'
import { CronJob } from 'cron'
import { Logger } from '@nestjs/common'
import chalk from 'chalk'
import { ConfigService } from '../../config/envConfig/config.service'

@Injectable()
export class TasksService {
	constructor(private readonly configService: ConfigService) {}
	async Timeout() {
		const taskID = setTimeout(() => console.log('Task completed'), 2000)
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
