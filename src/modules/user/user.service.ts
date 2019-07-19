import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getMongoManager } from 'typeorm'
import {
	User,
	CreateUserInput,
	LoginResponse,
	LoginUserInput,
	UpdateUserInput
} from './user.entity'
import { MongoRepository } from 'typeorm'
import * as jwt from 'jsonwebtoken'
import { ApolloError } from 'apollo-server-core'
import { UserPermissionService } from '../userPermission/userPermission.service'

import { SiteService } from '../site/site.service'
import { UserPermission } from '../userPermission/userPermission.entity'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: MongoRepository<User>,
		private readonly userPermissionService: UserPermissionService,
		private readonly siteService: SiteService
	) {}

	async findAll(offset: number, limit: number): Promise<User[]> {
		// const message = 'No Content'
		// const code = '204'
		// const additionalProperties = {}

		const users = await this.userRepository.find({
			where: { username: { $ne: 'admin' } },
			order: { createdAt: 'DESC' },
			skip: offset,
			take: limit,
			cache: true
		})

		// if (users.length === 0) {
		// 	getMongoManager additionalProperties)
		// }getMongoManager
		return users
	}

	async findById(_id: string): Promise<User> {
		const message = 'Not Found: User'
		const code = '404'
		const additionalProperties = {}

		const user = await this.userRepository.findOne({ _id })

		if (!user) {
			throw new ApolloError(message, code, additionalProperties)
		}

		return user
	}

	async create(input: CreateUserInput): Promise<User> {
		const message = 'Conflict: Username'
		const code = '409'
		const additionalProperties = {}

		// const { username, password, fullName, siteId, permissions } = input
		const { username, password, fullName, sites } = input

		const existedUser = await this.userRepository.findOne({ username })

		if (existedUser) {
			throw new ApolloError(message, code, additionalProperties)
		}

		const user = new User()
		user.username = username
		user.password = password
		user.fullName = fullName

		const newUser = await this.userRepository.save(user)

		sites.map(async item => {
			const { siteId, permissions } = item

			// await this.siteService.findById(siteId)

			const userPermission = new UserPermission()

			userPermission.userId = newUser._id
			userPermission.siteId = siteId
			userPermission.permissions = permissions

			this.userPermissionService.create(userPermission)
		})

		return null
	}

	async update(_id: string, input: UpdateUserInput): Promise<boolean> {
		const message = 'Not Found: User'
		const code = '404'
		const additionalProperties = {}

		// const { fullName, siteId, permissions } = input
		const { password, fullName, sites } = input

		const user = await this.userRepository.findOne({ _id })

		if (!user) {
			throw new ApolloError(message, code, additionalProperties)
		}

		user.password = password
		user.fullName = fullName

		await this.userRepository.save(user)

		sites.map(async item => {
			await this.siteService.findById(item.siteId)

			const userPermission = new UserPermission()

			userPermission.userId = user._id
			userPermission.siteId = item.siteId
			userPermission.permissions = item.permissions

			await this.userPermissionService.create(userPermission)
		})

		return true
	}

	async delete(_id: string): Promise<boolean> {
		const message = 'Not Found: User'
		const code = '404'
		const additionalProperties = {}

		const user = await this.userRepository.findOne({ _id })

		if (!user) {
			throw new ApolloError(message, code, additionalProperties)
		}

		user.isActive = false

		return (await this.userRepository.save(user)) ? true : false
	}

	async deleteAll(): Promise<boolean> {
		return (await this.userRepository.deleteMany({
			username: { $ne: 'admin' }
		}))
			? true
			: false
	}

	async login(input: LoginUserInput): Promise<LoginResponse> {
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

		const userPermissions = await getMongoManager()
			.aggregate(UserPermission, [
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
				// {
				// 	$project: {
				// 		siteName: {
				// 			_id: false,
				// 			createdAt: false,
				// 			updatedAt: false
				// 		}
				// 	}
				// }
			])
			.toArray()

		userPermissions.map(item => (item.siteName = item.siteName.name))

		return { token, userPermissions }
	}

	async findOneByToken(token: string) {
		const message = 'Invalid Token'
		const code = '498'
		const additionalProperties = {}

		let currentUser

		try {
			let decodeToken

			decodeToken = await jwt.verify(token, process.env.SECRET_KEY)

			currentUser = await this.userRepository.findOne({
				_id: decodeToken.subject
			})
		} catch (error) {
			throw new ApolloError(message, code, additionalProperties)
		}

		return currentUser
	}

	async lockAndUnlockUser(_id: string): Promise<boolean> {
		const message = 'Not Found: User'
		const code = '404'
		const additionalProperties = {}

		const user = await this.userRepository.findOne({ _id })

		if (!user) {
			throw new ApolloError(message, code, additionalProperties)
		}

		user.isLocked = !user.isLocked

		return (await this.userRepository.save(user)) ? true : false
	}
}
