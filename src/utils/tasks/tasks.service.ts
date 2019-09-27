import { Injectable } from '@nestjs/common'

@Injectable()
export class TasksService {
	async Timeout() {
		const taskID = setTimeout(() => console.log('Task completed'), 2000)
		// clearTimeout(taskID);
	}

	async Interval() {
		const intervalID = setInterval(() => console.log('Task executed'), 2000)
		// clearInterval(intervalID);
	}

	async Cron() {
		const cron = require('cron')

		const cronJob = cron.job('* * 15 * * MON-FRI', () => {
			console.info('Cron job completed')
		})
		cronJob.start()
	}
}
