import { Injectable } from '@nestjs/common'
import { CronJob } from 'cron'

@Injectable()
export class TasksService {
	async Timeout() {
		const taskID = setTimeout(() => console.log('Task completed'), 2000)
		// clearTimeout(taskID);
	}

	async Interval() {
		const intervalID = setInterval(() => console.log('Task executed'), 4000)
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
