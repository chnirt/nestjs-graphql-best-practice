import { Email } from './email.entity'

describe('Email class', () => {
	const email = new Email({})
	it('save should be defined', () => {
		expect(email.save())
	})

	it('save should be defined', () => {
		expect(email.update())
	})
})
