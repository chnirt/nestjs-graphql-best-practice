import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserResolver } from './user.resolver'
import { UserPermissionResolver } from '../userPermission/userPermission.resolver'
import { HistoryResolver } from '../history/history.resolver'
import { User } from './user.entity'
import { History } from '../history/history.entity'
import { UserPermission } from '../userPermission/userPermission.entity'

describe('UserResolver', () => {
	let resolver: UserResolver
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

		resolver = module.get<UserResolver>(UserResolver)
	})

	describe('defined', () => {
		it('should be defined', () => {
			expect(resolver).toBeDefined()
		})
	})

	describe('hello', () => {
		it('should return an string', async () => {
			const word = 'world'
			const result = Promise.resolve(word)
			jest.spyOn(resolver, 'hello').mockImplementation(() => result)
			expect(await resolver.hello()).toBe(word)
		})
	})

	describe('users', () => {
		it('should return an array of users', async () => {
			const result = [new User()]
			jest
				.spyOn(resolver, 'users')
				.mockImplementation(() => Promise.resolve(result))

			expect(await resolver.users(0, 100)).toBe(result)
		})
	})

	describe('lockAndUnlockUser', () => {
		it('should return boolean', async () => {
			const result = true
			const _id = '4a858710-bfed-11e9-ae42-4b976ee8364c'
			const reason = 'Unknown'
			jest
				.spyOn(resolver, 'lockAndUnlockUser')
				.mockImplementation(() => Promise.resolve(result))

			expect(await resolver.lockAndUnlockUser(_id, reason, null)).toBe(result)
		})
	})
})
