import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserResolver } from './user.resolver'
import { UserPermissionResolver } from '../userPermission/userPermission.resolver'
import { HistoryResolver } from '../history/history.resolver'
import { User } from '../../models/user.entity'
import { History } from '../../models/history.entity'
import { UserPermission } from '../../models/userPermission.entity'
import { AuthService } from '../../auth/auth.service'
import { MailService } from '../../utils/mail/mail.service'
import { LoginResponse } from '../../models/user.entity'

describe('UserResolver', () => {
	let userResolver: UserResolver
	// let userPermissionResolver: UserPermissionResolver
	// let historyResolver: HistoryResolver

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserResolver,
				{
					provide: getRepositoryToken(User),
					useClass: Repository
				},
				AuthService,
				MailService,
				UserPermissionResolver,
				{
					provide: getRepositoryToken(UserPermission),
					useClass: Repository
				},
				HistoryResolver,
				{
					provide: getRepositoryToken(History),
					useClass: Repository
				}
			]
		}).compile()

		userResolver = module.get<UserResolver>(UserResolver)
	})

	it('should be defined', () => {
		expect(userResolver).toBeDefined()
	})

	it('hello should return world', async () => {
		const word = 'world'
		const result = Promise.resolve(word)
		jest.spyOn(userResolver, 'hello').mockImplementation(() => result)
		expect(await userResolver.hello()).toBe(word)
	})

	it('should return users', async () => {
		const result = [new User()]
		jest
			.spyOn(userResolver, 'users')
			.mockImplementation(() => Promise.resolve(result))

		expect(await userResolver.users(0, 100)).toBe(result)
	})

	it('login should return loginResponse', async () => {
		const user = new User()
		user.email = 'nhocpo.juzo@gmail.com'
		user.password =
			'$2b$10$zZlBfV2IMrXPnbtHd1Bwqus97HvLE28N9.rCvNSUURFQdDD945fXK'

		const loginResponse = new LoginResponse()
		jest
			.spyOn(userResolver, 'login')
			.mockImplementation(() => Promise.resolve(loginResponse))

		expect(await userResolver.login(user, null)).toBe(loginResponse)
	})

	it('lockAndUnlockUser should return boolean', async () => {
		const result = true
		const _id = '4a858710-bfed-11e9-ae42-4b976ee8364c'
		const reason = 'Unknown'
		jest
			.spyOn(userResolver, 'lockAndUnlockUser')
			.mockImplementation(() => Promise.resolve(result))

		expect(await userResolver.lockAndUnlockUser(_id, reason, null)).toBe(result)
	})
})
