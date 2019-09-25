import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { User, UserPermission } from '../models'
import { LoginResponse } from '../graphql.schema'

describe('AuthResolver', () => {
	let authService: AuthService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService
				// {
				// 	provide: getRepositoryToken(Cat),
				// 	// define all the methods that you use from the catRepo
				// 	// give proper return values as expected or mock implementations, your choice
				// 	useValue: {
				// 		find: jest.fn().mockResolvedValue(catArray),
				// 		findOneOrFail: jest.fn().mockResolvedValue(oneCat),
				// 		create: jest.fn().mockReturnValue(oneCat),
				// 		save: jest.fn(),
				// 		// as these do not actually use their return values in our sample
				// 		// we just make sure that their resolee is true to not crash
				// 		update: jest.fn().mockResolvedValue(true),
				// 		// as these do not actually use their return values in our sample
				// 		// we just make sure that their resolee is true to not crash
				// 		delete: jest.fn().mockResolvedValue(true)
				// 	}
				// }
			]
		}).compile()

		authService = module.get<AuthService>(AuthService)
	})

	it('should be defined', () => {
		expect(authService).toBeDefined()
	})

	it('generateTokenAndUserPermissions should be defined', () => {
		const user = new User()
		expect(authService.generateTokenAndUserPermissions(user))
	})

	// it('tradeToken should be defined', () => {
	// 	const user = new User()
	// 	user.email = 'nhocpo.juzo@gmail.com'
	// 	user.password = '12345678'
	// 	expect(authService.tradeToken(user.email, user.password))
	// })

	// it('verifyToken should be defined', () => {
	// 	const token = ''
	// 	expect(authService.verifyToken(token))
	// })

	// it('generateTokenAndUserPermissions should return { token, userPermissions }', () => {
	// 	const user = new User()
	// 	user._id = 'c30c0730-be4f-11e9-9f04-f72d443f7ef2'
	// 	user.email = 'nhocpo.juzo@gmail.com'
	// 	user.password = '12345678'

	// 	const loginResponse = new LoginResponse()

	// 	const result = Promise.resolve(loginResponse)
	// 	jest
	// 		.spyOn(authService, 'generateTokenAndUserPermissions')
	// 		.mockImplementation(() => result)
	// 	expect(authService.generateTokenAndUserPermissions(user)).toBe(result)
	// })
})
