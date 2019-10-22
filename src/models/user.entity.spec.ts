import { User } from './user.entity'

import { hashPassword, comparePassword } from '../utils/password'

describe('User class', () => {
	const user = new User({})
	user.password = '$2b$10$Vz50uKhwY.otm5wzKpzDq.ojDwHg819UDBAdoCiOEzrCcNS0/95f6'
	it('save should be defined', () => {
		expect(user.save())
	})

	it('update should be defined', () => {
		expect(user.update())
	})

	it('hashPassword should be defined', () => {
		expect(hashPassword('12345678'))
	})

	it('matchesPassword should be defined', () => {
		expect(comparePassword('12345678', user.password))
	})
})
