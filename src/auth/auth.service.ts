import { Injectable } from '@nestjs/common'
import { getMongoRepository } from 'typeorm'
import { sign, verify } from 'jsonwebtoken'
import { ApolloError } from 'apollo-server-core'
import { User, LoginResponse } from '../models/user.entity'
import { UserPermission } from '../models/userPermission.entity'
import * as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class AuthService {
	async generateTokenAndUserPermissions(user: User): Promise<LoginResponse> {
		const token = await sign(
			{
				issuer: 'http://lunchapp4.dev.io',
				subject: user._id,
				audience: user.email
			},
			process.env.SECRET_KEY!,
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

		const array = ['MENU', 'ORDER', 'USER', 'REPORT', 'HISTORY']

		await userPermissions.map(item => {
			const sitepermissions = array.filter(
				item1 =>
					item.permissions
						.map(item2 => item2.code.split('_')[0])
						.indexOf(item1) !== -1
			)
			item.sitepermissions = sitepermissions
		})

		return {
			token,
			userPermissions
		}
	}

	async tradeToken(email: string, password: string): Promise<LoginResponse> {
		const user = await getMongoRepository(User).findOne({ email })

		if (!user || !(await user.matchesPassword(password))) {
			throw new ApolloError('Unauthorized', '401', {})
		}

		if (!user.isActive) {
			throw new ApolloError('Gone', '404', {})
		}

		if (user.isLocked) {
			throw new ApolloError('Locked', '423', {})
		}

		return this.generateTokenAndUserPermissions(user)
	}

	async verifyToken(token: string): Promise<User> {
		try {
			let currentUser

			const decodeToken = await verify(token, process.env.SECRET_KEY!)

			currentUser = await getMongoRepository(User).findOne({
				_id: decodeToken.subject
			})

			if (!currentUser.isActive) {
				throw new ApolloError('Invalid Token', '498', {})
			}

			if (currentUser.isLocked) {
				throw new ApolloError('Invalid Token', '498', {})
			}

			return currentUser
		} catch (error) {
			throw new ApolloError('Invalid Token', '498', {})
		}
	}
}
