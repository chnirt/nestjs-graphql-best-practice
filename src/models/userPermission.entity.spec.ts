import { UserPermission } from './userPermission.entity'

describe('UserPermission class', () => {
	const userPermission = new UserPermission()
	it('save should be defined', () => {
		expect(userPermission.save())
	})
})
