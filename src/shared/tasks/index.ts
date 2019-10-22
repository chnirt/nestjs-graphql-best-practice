import { CronJob } from 'cron'

export const timeout = () => {
	const taskID = setTimeout(() => console.log('Task completed'), 2000)
	clearTimeout(taskID)
}

export const interval = () => {
	const intervalID = setInterval(() => console.log('Task executed'), 4000)
	clearInterval(intervalID)
}

export const cron = () => {
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
