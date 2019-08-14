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
import * as jwt from 'jsonwebtoken'
import * as uuid from 'uuid'
import {
	User,
	CreateUserInput,
	UpdateUserInput,
	LoginResponse,
	LoginUserInput
} from './user.entity'
import { UserPermission } from '../userPermission/userPermission.entity'

@Resolver('User')
export class UserResolver {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: MongoRepository<User>
	) {}

	@Query(() => String)
	hello() {
		return uuid.v1()
	}

	@Query(() => User)
	me(@Context('currentUser') currentUser: User) {
		return currentUser
	}

	@Query(() => [User])
	async users(@Args('offset') offset: number, @Args('limit') limit: number) {
		const users = await this.userRepository.find({
			where: { username: { $ne: 'admin' } },
			order: { createdAt: 'DESC' },
			skip: offset,
			take: limit,
			cache: true
		})

		return await users
	}

	@Query(() => User)
	async user(@Args('_id') _id: string) {
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
	) {
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

			pubSub.publish('userCreated', { userCreated: createdUser })

			sites.map(async item => {
				const { siteId, permissions } = item

				const userPermission = new UserPermission()

				userPermission.userId = createdUser._id
				userPermission.siteId = siteId
				userPermission.permissions = permissions

				getMongoRepository(UserPermission).save(userPermission)
			})

			return createdUser
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	@Mutation(() => Boolean)
	async updateUser(
		@Args('_id') _id: string,
		@Args('input') input: UpdateUserInput
	) {
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
					const userPermission = new UserPermission()
					userPermission.userId = user._id
					userPermission.siteId = siteId
					userPermission.permissions = permissions

					return await getMongoRepository(UserPermission).save(userPermission)
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
	async deleteUser(@Args('_id') _id: string) {
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
	async deleteUsers() {
		try {
			return (await this.userRepository.deleteMany({
				username: { $ne: 'admin' }
			}))
				? true
				: false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	@Mutation(() => LoginResponse)
	async login(@Args('input') input: LoginUserInput, @Context('req') req: any) {
		const message = 'Unauthorized'
		const code = '401'
		const additionalProperties = {}

		const { username, password } = input

		const user = await this.userRepository.findOne({ username })

		if (!user || !(await user.matchesPassword(password))) {
			throw new ApolloError(message, code, additionalProperties)
		}

		const activeMessage = 'Gone'
		const activeCode = '404'
		const activeAdditionalProperties = {}

		if (!user.isActive) {
			throw new ApolloError(
				activeMessage,
				activeCode,
				activeAdditionalProperties
			)
		}

		const lockedMessage = 'Locked'
		const lockedCode = '423'
		const lockedAdditionalProperties = {}

		if (user.isLocked) {
			throw new ApolloError(
				lockedMessage,
				lockedCode,
				lockedAdditionalProperties
			)
		}

		const token = jwt.sign(
			{
				issuer: 'http://lunchapp2.dev.io',
				subject: user._id,
				audience: user.username
			},
			process.env.SECRET_KEY,
			{
				expiresIn: '30d'
			}
		)

		const userPermissions = await getMongoRepository(UserPermission)
			.aggregate([
				{
					$match: {
						userId: user._id
					}
				},
				{
					$lookup: {
						from: 'site',
						localField: 'siteId',
						foreignField: '_id',
						as: 'siteName'
					}
				},
				{
					$unwind: {
						path: '$siteName',
						preserveNullAndEmptyArrays: true
					}
				}
			])
			.toArray()

		userPermissions.map(item => (item.siteName = item.siteName.name))

		const array = ['MENU', 'ORDER', 'USER', 'REPORT']

		await userPermissions.map(item => {
			const sitepermissions = array.filter(
				item1 =>
					item.permissions
						.map(item2 => item2.code.split('_')[0])
						.indexOf(item1) !== -1
			)
			item.sitepermissions = sitepermissions
		})

		return { token, userPermissions }
	}

	@Mutation(() => Boolean)
	async lockAndUnlockUser(
		@Args('_id') _id: string,
		@Args('reason') reason: string
	) {
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

			return (await this.userRepository.save(user)) ? true : false
		} catch (error) {
			throw new ApolloError(error, '500', {})
		}
	}

	@Subscription()
	async userCreated(@Context('pubSub') pubSub: any) {
		return await pubSub.asyncIterator('userCreated')
	}
}
