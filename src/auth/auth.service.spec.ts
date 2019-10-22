import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { User } from '../models'
import { LoginResponse } from '../generator/graphql.schema'

describe('AuthResolver', () => {
	let service

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

		service = module.get<AuthService>(AuthService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	it('generateTokenAndUserPermissions should be defined', () => {
		const user = new User()
		expect(service.generateToken(user))
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
})
