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
import * as nodemailer from 'nodemailer'
// import * as hbs from 'nodemailer-express-handlebars'
// import * as path from 'path'

import {
	User,
	CreateUserInput,
	UpdateUserInput,
	LoginResponse,
	LoginUserInput
} from './user.entity'
import { UserPermission } from '../userPermission/userPermission.entity'
import { UserPermissionResolver } from '../userPermission/userPermission.resolver'
import { HistoryResolver } from '../history/history.resolver'
import { CreateUserPermissionInput } from '../../graphql'
import { History } from '../history/history.entity'

@Resolver('User')
export class UserResolver {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: MongoRepository<User>,
		private readonly userPermissionResolver: UserPermissionResolver,
		private readonly historyResolver: HistoryResolver
	) {}

	@Query(() => String)
	async hello(): Promise<string> {
		// return uuid.v1()
		return await 'world'
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
				issuer: 'http://lunchapp4.dev.io',
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
		@Context('req') req: any
	): Promise<any> {
		const message = 'Not Found: Email'
		const code = '404'
		const additionalProperties = {}

		const existedUser = await this.userRepository.findOne({ username: email })

		if (!existedUser) {
			throw new ApolloError(message, code, additionalProperties)
		}

		const token = '$2y$12$2SJ7/SwsMq4St5EPqRdh5OMm.sfAkchcXSFJn9SEqL/ekmGusAXhm'

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'trinhchin.innos@gmail.com',
				pass: 'Matkhaula1!'
			}
		})

		// const handlebarsOptions = {
		// 	viewEngine: 'handlebars',
		// 	viewPath: path.resolve('src/assets/templates'),
		// 	extName: '.html'
		// }

		// transporter.use('compile', hbs(handlebarsOptions))

		const mailOptions = {
			from: 'Acexis 📧 trinhchin.innos@gmail.com', // sender address
			to: 'nhocpo.juzo@gmail.com', // list of receivers
			subject: 'Reset your password by e-mail',
			text:
				'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' +
				req.headers.host +
				'/reset/' +
				token +
				'\n\n' +
				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		}

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				// console.log(err)
				throw new ApolloError(err.message, '500', {})
			} else {
				// console.log(info)
			}
		})
		return true
	}

	@Subscription(() => User)
	async userCreated(@Context('pubSub') pubSub: any): Promise<User> {
		return await pubSub.asyncIterator('userCreated')
	}
}
