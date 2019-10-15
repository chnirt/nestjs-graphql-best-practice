import { Message } from './message.entity'

describe('Message class', () => {
	const message = new Message({})
	it('save should be defined', () => {
		expect(message.save())
	})

	it('save should be defined', () => {
		expect(message.update())
	})
})
