import { User } from './user.entity'

describe('User class', () => {
	it('save should be defined', () => {
		const user = new User()

		// user._id = '1'
		// user.firstName = '2'
		// user.lastName = '3'
		// user.email = '4'
		// user.password = '5'
		// user.resetPasswordToken = '6'
		// user.resetPasswordExpires = 7
		// user.isLocked = true
		// user.reason = '9'
		// user.isActive = false
		// user.createdAt = 10
		// user.updatedAt = 11
		// expect(user).toBeTruthy()

		expect(user.save()).toBeDefined()
	})

	it('update should be defined', () => {
		const user = new User()
		expect(user.update())
	})

	it('hashPassword should be defined', () => {
		const user = new User()
		expect(user.hashPassword(user.password)).toBeDefined()
	})

	it('matchesPassword should be defined', () => {
		const user = new User()
		expect(user.matchesPassword(user.password)).toBeDefined()
	})
})
