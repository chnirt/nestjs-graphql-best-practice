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
import {
	ApolloError,
	AuthenticationError,
	ForbiddenError,
	UserInputError
} from 'apollo-server-core'
import * as uuid from 'uuid'
import {
	CreateUserInput,
	UpdateUserInput,
	LoginUserInput
} from '../../models/user.entity'
import { User } from '../../models'
import { AuthService } from '../../auth/auth.service'
import { MailService } from '../../shared/mail/mail.service'
import { EmailResolver } from '../email/email.resolver'
import {
	Result,
	SearchInput,
	UserResult,
	LoginResponse,
	RefreshTokenResponse
} from '../../generator/graphql.schema'

import { USER_SUBSCRIPTION } from '../../environments'

@Resolver('User')
export class UserResolver {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: MongoRepository<User>,
		private readonly authService: AuthService,
		private readonly mailService: MailService,
		private readonly emailResolver: EmailResolver
	) {}

	// COMPLETE:
	@Query(() => String)
	async hello(): Promise<string> {
		return uuid.v1()
		// return await 'world'
	}

	// COMPLETE:
	@Query(() => Date)
	async today(): Promise<Date> {
		return new Date()
	}

	// COMPLETE:
	@Query()
	async search(@Args('conditions') conditions: SearchInput): Promise<Result[]> {
		let result

		const { select, where, order, skip, take } = conditions

		if (Object.keys(where).length > 1) {
			throw new ApolloError('Your where must be 1 collection', '400', {})
		}

		const type = Object.keys(where)[0]

		// const createdAt = { $gte: 0, $lte: new Date().getTime() }

		result = await getMongoRepository(type).find({
			where: where[type] && JSON.parse(JSON.stringify(where[type])),
			order: order && JSON.parse(JSON.stringify(order)),
			skip,
			take
		})

		// console.log(result)

		if (result.length === 0) {
			throw new ForbiddenError('Not found.')
		}

		return result
	}

	// COMPLETE:
	@Query()
	async searchUser(@Args('userIds') userIds: string[]): Promise<UserResult> {
		let result

		if (userIds.length === 0) {
			throw new ApolloError('userIds can not be blank', '400', {})
		}

		result = await this.userRepository.find({
			where: {
				_id: { $in: userIds }
			}
		})

		// tslint:disable-next-line:prefer-conditional-expression
		if (result.length > 1) {
			result = { users: result }
		} else {
			result = result[0]
		}

		return result
	}

	// COMPLETE:
	@Query(() => User)
	async me(@Context('currentUser') currentUser: User) {
		return currentUser
	}

	// COMPLETE:
	@Query(() => [User])
	async users(
		@Args('offset') offset: number,
		@Args('limit') limit: number
	): Promise<User[]> {
		const users = await this.userRepository.find({
			// where: { email: { $nin: ['nhocpo.juzo@gmail.com'] } },
			// order: { createdAt: -1 },
			skip: offset,
			take: limit,
			cache: true // 1000: 60000 / 1 minute
		})

		return users
	}

	// COMPLETE:
	@Query(() => User)
	async user(@Args('_id') _id: string): Promise<User> {
		try {
			const user = await this.userRepository.findOne({ _id })

			if (!user) {
				throw new ForbiddenError('User not found.')
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
		@Context('pubsub') pubsub: any,
		@Context('req') req: any
	): Promise<User> {
		try {
			const { firstName, lastName, email, password, gender } = input

			const existedUser = await this.userRepository.findOne({ email })

			if (existedUser) {
				throw new ForbiddenError('User already exists.')
			}

			const user = new User()
			user.firstName = firstName
			user.lastName = lastName
			user.email = email
			user.password = await user.hashPassword(password)
			user.gender = gender

			const createdUser = await this.userRepository.save(user)

			pubsub.publish(USER_SUBSCRIPTION, { userCreated: createdUser })

			const emailToken = await this.authService.generateEmailToken(createdUser)

			const existedEmail = await this.emailResolver.createEmail({
				userId: createdUser._id,
				type: 'verifyEmail'
			})

			await this.mailService.sendMail(
				'verifyEmail',
				createdUser,
				req,
				emailToken,
				existedEmail._id
			)

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
			const { firstName, lastName, password, gender } = input

			const user = await this.userRepository.findOne({ _id })

			if (!user) {
				throw new ForbiddenError('User not found.')
			}

			user.firstName = firstName
			user.lastName = lastName
			user.password = await user.hashPassword(password)
			user.gender = gender

			return (await this.userRepository.save(user)) ? true : false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	// COMPLETE:
	@Mutation(() => Boolean)
	async deleteUser(@Args('_id') _id: string): Promise<boolean> {
		try {
			const user = await this.userRepository.findOne({ _id })

			if (!user) {
				throw new ForbiddenError('User not found.')
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
				email: { $nin: ['nhocpo.juzo@gmail.com'] }
			}))
				? true
				: false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	// COMPLETE:
	@Mutation(() => Boolean)
	async verifyEmail(@Args('emailToken') emailToken: string): Promise<boolean> {
		const user = await this.authService.verifyEmailToken(emailToken)

		if (!user.isVerified) {
			user.isVerified = true
			return (await this.userRepository.save(user)) ? true : false
		} else {
			throw new ForbiddenError('Your email has been verified.')
		}
	}

	// COMPLETE:
	@Mutation(() => LoginResponse)
	async login(@Args('input') input: LoginUserInput): Promise<LoginResponse> {
		const { email, password } = input

		return await this.authService.tradeToken(email, password)
	}

	// COMPLETE:
	@Mutation(() => Boolean)
	async refreshToken(
		@Args('refreshToken') refreshToken: string
	): Promise<RefreshTokenResponse> {
		const user = await this.authService.verifyRefreshToken(refreshToken)

		const accessToken = await this.authService.generateToken(user)

		return { accessToken }
	}

	// COMPLETE:
	@Mutation(() => Boolean)
	async lockAndUnlockUser(
		@Args('_id') _id: string,
		@Args('reason') reason: string,
		@Context('currentUser') currentUser: User
	): Promise<boolean> {
		try {
			const user = await this.userRepository.findOne({ _id })

			if (!user) {
				throw new ForbiddenError('User not found.')
			}

			user.reason = !user.isLocked ? reason : ''
			user.isLocked = !user.isLocked

			return (await this.userRepository.save(user)) ? true : false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	// COMPLETE:
	@Mutation(() => Boolean)
	async changePassword(
		@Args('_id') _id: string,
		@Args('currentPassword') currentPassword: string,
		@Args('password') password: string
	): Promise<boolean> {
		const user = await this.userRepository.findOne({ _id })

		// console.log(currentPassword , password)

		if (!user) {
			throw new ForbiddenError('User not found.')
		}

		if (!(await user.matchesPassword(currentPassword))) {
			throw new ForbiddenError('Your current password is missing or incorrect.')
		}

		if (await user.matchesPassword(password)) {
			throw new UserInputError(
				'Your new password must be different from your previous password.'
			)
		}

		user.password = await user.hashPassword(password)

		return (await this.userRepository.save(user)) ? true : false
	}

	// COMPLETE:
	@Mutation(() => Boolean)
	async forgotPassword(
		@Args('email') email: string,
		@Context('req') req: any
	): Promise<boolean> {
		const user = await this.userRepository.findOne({
			email,
			isVerified: true
		})

		if (!user) {
			throw new ForbiddenError('User not found.')
		}

		const resetPassToken = await this.authService.generateResetPassToken(user)

		const existedEmail = await this.emailResolver.createEmail({
			userId: user._id,
			type: 'forgotPassword'
		})

		await this.mailService.sendMail(
			'forgotPassword',
			user,
			req,
			resetPassToken,
			existedEmail._id
		)

		const date = new Date()
		user.resetPasswordToken = resetPassToken
		user.resetPasswordExpires = date.setHours(date.getHours() + 1) // 1 hour

		return (await this.userRepository.save(user)) ? true : false
	}

	// COMPLETE:
	@Mutation(() => Boolean)
	async resetPassword(
		@Args('resetPasswordToken') resetPasswordToken: string,
		@Args('password') password: string
	): Promise<boolean> {
		const user = await this.userRepository.findOne({
			resetPasswordToken
		})

		if (!user) {
			throw new ForbiddenError('User not found.')
		}

		if (user.resetPasswordExpires < Date.now()) {
			throw new AuthenticationError(
				'Reset password token is invalid, please try again.'
			)
		}

		user.password = await user.hashPassword(password)
		user.resetPasswordToken = null
		user.resetPasswordExpires = null

		return (await this.userRepository.save(user)) ? true : false
	}

	// COMPLETE:
	@Subscription(() => Object, {
		filter: (payload: any, variables: any) => {
			// console.log('payload', payload)
			// console.log('variables', variables)
			// return payload.menuPublishByOrder.currentsite === variables.currentsite
			return true
		}
	})
	async userCreated(@Context('pubsub') pubsub: any): Promise<User> {
		return pubsub.asyncIterator(USER_SUBSCRIPTION)
	}

	// COMPLETE:
	@ResolveProperty(() => String)
	async fullName(@Parent() user: User): Promise<string> {
		const { firstName, lastName } = user
		return `${firstName} ${lastName}`
	}

	@ResolveProperty(() => String)
	async password(@Parent() user: User): Promise<string> {
		return ''
	}
}
