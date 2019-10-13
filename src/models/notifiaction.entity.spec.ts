import { Notification } from './notification.entity'

describe('Notification class', () => {
	const notification = new Notification({})
	it('save should be defined', () => {
		expect(notification.save())
	})

	it('save should be defined', () => {
		expect(notification.update())
	})
})
