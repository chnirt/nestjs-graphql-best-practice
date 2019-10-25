import { User } from './user.entity'

describe('User class', () => {
	const user = new User({})
	it('save should be defined', () => {
		expect(user.save())
	})

	it('update should be defined', () => {
		expect(user.update())
	})
})
