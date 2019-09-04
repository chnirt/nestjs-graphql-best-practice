import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { User } from '../models/user.entity'
import { LoginResponse } from '../graphql'

describe('AuthResolver', () => {
	let authService: AuthService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService]
		}).compile()

		authService = module.get<AuthService>(AuthService)
	})

	it('should be defined', () => {
		expect(authService).toBeDefined()
	})

	it('generateTokenAndUserPermissions should return { token, userPermissions }', () => {
		const user = new User()
		user._id = 'c30c0730-be4f-11e9-9f04-f72d443f7ef2'
		user.email = 'nhocpo.juzo@gmail.com'

		const loginResponse = new LoginResponse()

		const result = Promise.resolve(loginResponse)
		jest
			.spyOn(authService, 'generateTokenAndUserPermissions')
			.mockImplementation(() => result)
		expect(authService.generateTokenAndUserPermissions(user)).toBe(result)
	})
})
