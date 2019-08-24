import { Injectable } from '@nestjs/common'
import { MongoRepository, getMongoRepository } from 'typeorm'
import * as jwt from 'jsonwebtoken'
import { ApolloError } from 'apollo-server-core'
import { User, LoginResponse } from '../modules/user/user.entity'
import { UserPermission } from '../modules/userPermission/userPermission.entity'
import * as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class AuthService {
	async generateTokenAndUserPermissions(user: User): Promise<LoginResponse> {
		const token = await jwt.sign(
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

		return await {
			token,
			userPermissions
		}
	}

	async tradeToken(username: string, password: string): Promise<LoginResponse> {
		const message = 'Unauthorized'
		const code = '401'
		const additionalProperties = {}

		const user = await getMongoRepository(User).findOne({ username })

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

		return await this.generateTokenAndUserPermissions(user)
	}

	async verifyToken(token: string): Promise<User> {
		const message = 'Invalid Token'
		const code = '498'
		const additionalProperties = {}

		try {
			let currentUser

			const decodeToken = await jwt.verify(token, process.env.SECRET_KEY)

			currentUser = await getMongoRepository(User).findOne({
				_id: decodeToken.subject
			})

			return currentUser
		} catch (error) {
			throw new ApolloError(message, code, additionalProperties)
		}
	}
}
