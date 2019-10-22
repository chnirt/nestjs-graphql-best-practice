import { Role } from './role.entity'

describe('Role class', () => {
	const role = new Role({})
	it('save should be defined', () => {
		expect(role.save())
	})

	it('save should be defined', () => {
		expect(role.update())
	})
})
