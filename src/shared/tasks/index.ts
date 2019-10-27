import { CronJob } from 'cron'

/**
 * Returns any.
 *
 * @remarks
 * This method is part of the {@link shared/tasks}.
 *
 * @returns any
 *
 * @beta
 */
export const timeout = () => {
	const taskID = setTimeout(() => console.log('Task completed'), 1000)
	// clearTimeout(taskID)
}

/**
 * Returns any.
 *
 * @remarks
 * This method is part of the {@link shared/tasks}.
 *
 * @returns any
 *
 * @beta
 */
export const interval = () => {
	const intervalID = setInterval(() => console.log('Task executed'), 2000)
	// clearInterval(intervalID)
}

/**
 * Returns any.
 *
 * @remarks
 * This method is part of the {@link shared/tasks}.
 *
 * @returns any
 *
 * @beta
 */
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
