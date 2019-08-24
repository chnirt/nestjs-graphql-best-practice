import {
	Resolver,
	Query,
	Mutation,
	Args,
	Subscription,
	Context
} from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository, getMongoRepository } from 'typeorm'
import { ApolloError } from 'apollo-server-core'
import * as uuid from 'uuid'

import {
	User,
	CreateUserInput,
	UpdateUserInput,
	LoginResponse,
	LoginUserInput
} from './user.entity'
import { AuthService } from '../../auth/auth.service'
import { MailService } from '../../utils/mail/mail.service'
import { UserPermission } from '../userPermission/userPermission.entity'
import { UserPermissionResolver } from '../userPermission/userPermission.resolver'
import { HistoryResolver } from '../history/history.resolver'
import { CreateUserPermissionInput } from '../../graphql'
import { History } from '../history/history.entity'
import { ForgotPasswordService } from '../../utils/forgotPassword/forgotPassword.service';

@Resolver('User')
export class UserResolver {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: MongoRepository<User>,
		private readonly authService: AuthService,
		private readonly mailService: MailService,
		private readonly userPermissionResolver: UserPermissionResolver,
		private readonly historyResolver: HistoryResolver,
		private readonly forgotpasswordService: ForgotPasswordService
	) {}

	@Query(() => String)
	async hello(): Promise<string> {
		return await uuid.v1()
		// return await 'world'
	}

	@Query(() => User)
	async me(@Context('currentUser') currentUser: User) {
		return await currentUser
	}

	@Query(() => [User])
	async users(
		@Args('offset') offset: number,
		@Args('limit') limit: number
	): Promise<User[]> {
		const users = await this.userRepository.find({
			where: { username: { $nin: ['admin', 'mod'] } },
			order: { createdAt: 'DESC' },
			skip: offset,
			take: limit,
			cache: true
		})

		return await users
	}

	@Query(() => User)
	async user(@Args('_id') _id: string): Promise<User> {
		try {
			const message = 'Not Found: User'
			const code = '404'
			const additionalProperties = {}

			const user = await this.userRepository.findOne({ _id })

			if (!user) {
				throw new ApolloError(message, code, additionalProperties)
			}

			return user
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	@Mutation(() => User)
	async createUser(
		@Args('input') input: CreateUserInput,
		@Context('pubSub') pubSub
	): Promise<User> {
		try {
			const message = 'Conflict: Username'
			const code = '409'
			const additionalProperties = {}

			const { username, password, fullName, sites } = input

			const existedUser = await this.userRepository.findOne({ username })

			if (existedUser) {
				throw new ApolloError(message, code, additionalProperties)
			}

			const user = new User()
			user.username = username
			user.password = password
			user.fullName = fullName

			const createdUser = await this.userRepository.save(user)

			sites.map(async item => {
				const { siteId, permissions } = item

				const createUserPermissionInput = new CreateUserPermissionInput()

				createUserPermissionInput.userId = createdUser._id
				createUserPermissionInput.siteId = siteId
				createUserPermissionInput.permissions = permissions

				this.userPermissionResolver.createUserPermission(
					createUserPermissionInput
				)
			})

			pubSub.publish('userCreated', { userCreated: createdUser })

			return createdUser
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	@Mutation(() => Boolean)
	async updateUser(
		@Args('_id') _id: string,
		@Args('input') input: UpdateUserInput
	): Promise<boolean> {
		try {
			const message = 'Not Found: User'
			const code = '404'
			const additionalProperties = {}

			const { password, fullName, sites } = input

			const user = await this.userRepository.findOne({ _id })

			if (!user) {
				throw new ApolloError(message, code, additionalProperties)
			}

			sites.map(async item => {
				const { siteId, permissions } = item

				const existedUserPermission = await getMongoRepository(
					UserPermission
				).findOne({
					userId: user._id,
					siteId
				})

				if (existedUserPermission) {
					existedUserPermission.permissions = permissions

					return await getMongoRepository(UserPermission).save(
						existedUserPermission
					)
				} else {
					const createUserPermissionInput = new CreateUserPermissionInput()

					createUserPermissionInput.userId = user._id
					createUserPermissionInput.siteId = siteId
					createUserPermissionInput.permissions = permissions

					return await this.userPermissionResolver.createUserPermission(
						createUserPermissionInput
					)
				}
			})

			user.password = await user.hashPassword(password)
			user.fullName = fullName

			return (await this.userRepository.save(user)) ? true : false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	@Mutation(() => Boolean)
	async deleteUser(@Args('_id') _id: string): Promise<boolean> {
		try {
			const message = 'Not Found: User'
			const code = '404'
			const additionalProperties = {}

			const user = await this.userRepository.findOne({ _id })

			if (!user) {
				throw new ApolloError(message, code, additionalProperties)
			}

			user.isActive = false

			return (await this.userRepository.save(user)) ? true : false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	@Mutation(() => Boolean)
	async deleteUsers(): Promise<boolean> {
		try {
			return (await this.userRepository.deleteMany({
				username: { $nin: ['admin', 'mod'] }
			}))
				? true
				: false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	@Mutation(() => LoginResponse)
	async login(
		@Args('input') input: LoginUserInput,
		@Context('req') req: any
	): Promise<LoginResponse> {
		const { username, password } = input

		const loginResponse = await this.authService.tradeToken(username, password)

		return loginResponse
	}

	@Mutation(() => Boolean)
	async lockAndUnlockUser(
		@Args('_id') _id: string,
		@Args('reason') reason: string,
		@Context('currentUser') currentUser: User
	): Promise<boolean> {
		try {
			const message = 'Not Found: User'
			const code = '404'
			const additionalProperties = {}

			const user = await this.userRepository.findOne({ _id })

			if (!user) {
				throw new ApolloError(message, code, additionalProperties)
			}

			user.reason = !user.isLocked ? reason : ''
			user.isLocked = !user.isLocked

			// console.log(currentUser)

			const history = new History()
			history.userId = currentUser._id
			history.description = user.isLocked
				? `${currentUser.fullName} locked ${user.fullName} because ${reason}`
				: `${currentUser.fullName} unlocked ${user.fullName}`

			this.historyResolver.createHistory(history)

			return (await this.userRepository.save(user)) ? true : false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	@Mutation(() => Boolean)
	async forgotPassword(
		@Args('email') email: string,
		// @Context('req') req: any
	): Promise<boolean> {
		await this.forgotpasswordService.forgotPassword(email)
		return true
	}

	@Subscription(() => User)
	async userCreated(@Context('pubSub') pubSub: any): Promise<User> {
		return await pubSub.asyncIterator('userCreated')
	}
}
