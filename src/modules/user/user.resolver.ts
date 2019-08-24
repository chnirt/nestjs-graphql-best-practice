import {
	Resolver,
	Query,
	Mutation,
	Args,
	Subscription,
	Context,
	ResolveProperty,
	Parent
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
import { ForgotPasswordService } from '../../utils/forgotPassword/forgotPassword.service'

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

	// COMPLETE:
	@Query(() => User)
	async me(@Context('currentUser') currentUser: User) {
		return await currentUser
	}

	// COMPLETE:
	@Query(() => [User])
	async users(
		@Args('offset') offset: number,
		@Args('limit') limit: number
	): Promise<User[]> {
		const users = await this.userRepository.find({
			where: { email: { $nin: ['nhocpo.juzo@gmail.com'] } },
			order: { createdAt: 'DESC' },
			skip: offset,
			take: limit,
			cache: true
		})

		return await users
	}

	// COMPLETE:
	@Query(() => User)
	async user(@Args('_id') _id: string): Promise<User> {
		try {
			const message = 'Not Found: User'
			const code = '404'

			const user = await this.userRepository.findOne({ _id })

			if (!user) {
				throw new ApolloError(message, code, {})
			}

			return user
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	// COMPLETE:
	@Mutation(() => User)
	async createUser(
		@Args('input') input: CreateUserInput,
		@Context('pubSub') pubSub
	): Promise<User> {
		try {
			const message = 'Conflict: Username'
			const code = '409'

			const { firstName, lastName, email, password, sites } = input

			const existedUser = await this.userRepository.findOne({ email })

			if (existedUser) {
				throw new ApolloError(message, code, {})
			}

			const user = new User()
			user.firstName = firstName
			user.lastName = lastName
			user.email = email
			user.password = password

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

	// COMPLETE:
	@Mutation(() => Boolean)
	async updateUser(
		@Args('_id') _id: string,
		@Args('input') input: UpdateUserInput
	): Promise<boolean> {
		try {
			const message = 'Not Found: User'
			const code = '404'

			const { firstName, lastName, password, sites } = input

			const user = await this.userRepository.findOne({ _id })

			if (!user) {
				throw new ApolloError(message, code, {})
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

			user.firstName = firstName
			user.lastName = lastName
			user.password = await user.hashPassword(password)

			return (await this.userRepository.save(user)) ? true : false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	// COMPLETE:
	@Mutation(() => Boolean)
	async deleteUser(@Args('_id') _id: string): Promise<boolean> {
		try {
			const message = 'Not Found: User'
			const code = '404'

			const user = await this.userRepository.findOne({ _id })

			if (!user) {
				throw new ApolloError(message, code, {})
			}

			user.isActive = false

			return (await this.userRepository.save(user)) ? true : false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	// COMPLETE:
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

	// COMPLETE:
	@Mutation(() => LoginResponse)
	async login(
		@Args('input') input: LoginUserInput,
		@Context('req') req: any
	): Promise<LoginResponse> {
		const { email, password } = input

		const loginResponse = await this.authService.tradeToken(email, password)

		return loginResponse
	}

	// COMPLETE:
	@Mutation(() => Boolean)
	async lockAndUnlockUser(
		@Args('_id') _id: string,
		@Args('reason') reason: string,
		@Context('currentUser') currentUser: User
	): Promise<boolean> {
		try {
			const message = 'Not Found: User'
			const code = '404'

			const user = await this.userRepository.findOne({ _id })

			if (!user) {
				throw new ApolloError(message, code, {})
			}

			user.reason = !user.isLocked ? reason : ''
			user.isLocked = !user.isLocked

			// console.log(currentUser)

			const history = new History()
			history.userId = currentUser._id
			history.description = user.isLocked
				? `${currentUser.email} locked ${user.email} because ${reason}`
				: `${currentUser.email} unlocked ${user.email}`

			this.historyResolver.createHistory(history)

			return (await this.userRepository.save(user)) ? true : false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	// COMPLETE:
	@Mutation(() => Boolean)
	async forgotPassword(
		@Args('email') email: string,
		@Context('req') req: any
	): Promise<boolean> {
		const message = 'Not Found: User'
		const code = '404'

		const user = await this.userRepository.findOne({
			email
		})

		if (!user) {
			throw new ApolloError(message, code, {})
		}

		const date = new Date()

		user.resetPasswordToken = uuid.v1()
		user.resetPasswordExpires = date.setHours(date.getHours() + 1) // 1 hour

		await this.userRepository.save(user)

		return (await this.mailService.sendMail(
			user.email,
			req,
			user.resetPasswordToken
		))
			? true
			: false
	}

	// COMPLETE:
	@Mutation(() => Boolean)
	async resetPassword(
		@Args('resetPasswordToken') resetPasswordToken: string,
		@Args('password') password: string
	) {
		const message = 'Not Found: User'
		const code = '404'

		const trpMessage = 'Invalid ResetPasswordToken'
		const trpCode = '498'

		const user = await this.userRepository.findOne({
			resetPasswordToken
		})

		if (!user) {
			throw new ApolloError(message, code, {})
		}

		if (user.resetPasswordExpires < Date.now()) {
			throw new ApolloError(trpMessage, trpCode, {})
		}

		user.password = await user.hashPassword(password)
		user.resetPasswordToken = null
		user.resetPasswordExpires = null

		return (await this.userRepository.save(user)) ? true : false
	}

	// COMPLETE:
	@Subscription(() => User)
	async userCreated(@Context('pubSub') pubSub: any): Promise<User> {
		return await pubSub.asyncIterator('userCreated')
	}

	// COMPLETE:
	@ResolveProperty(() => String)
	async fullName(@Parent() user: User): Promise<string> {
		const { firstName, lastName } = user
		return await `${firstName} ${lastName}`
	}
}
