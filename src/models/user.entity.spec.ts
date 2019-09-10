import { User } from './user.entity'

describe('User class', () => {
	const user = new User()
	it('save should be defined', () => {
		expect(user.save()).toBeDefined()
	})

	it('update should be defined', () => {
		expect(user.update())
	})

	it('hashPassword should be defined', () => {
		expect(user.hashPassword(user.password)).toBeDefined()
	})

	it('matchesPassword should be defined', () => {
		expect(user.matchesPassword(user.password)).toBeDefined()
	})
})
