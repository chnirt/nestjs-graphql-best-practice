import { Permission } from './permission.entity'

describe('Permission class', () => {
	const permission = new Permission()
	it('save should be defined', () => {
		expect(permission.save())
	})
})
