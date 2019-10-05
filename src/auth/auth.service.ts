import { Injectable } from '@nestjs/common'
import { getMongoRepository } from 'typeorm'
import { sign, verify } from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-core'
import { User } from '../models/user.entity'

import {
	ISSUER,
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET,
	RESETPASS_TOKEN_SECRET,
	EMAIL_TOKEN_SECRET
} from '../environments'

@Injectable()
export class AuthService {
	async generateToken(user: User): Promise<string> {
		return await sign(
			{
				issuer: ISSUER,
				subject: user._id,
				audience: user.email
			},
			ACCESS_TOKEN_SECRET!,
			{
				algorithm: 'HS256',
				expiresIn: '15m'
			}
		)
	}

	async generateRefreshToken(user: User): Promise<string> {
		return await sign(
			{
				issuer: ISSUER,
				subject: user._id,
				audience: user.email
			},
			REFRESH_TOKEN_SECRET!,
			{
				algorithm: 'HS256',
				expiresIn: '7d'
			}
		)
	}

	async generateResetPassToken(user: User): Promise<string> {
		return await sign(
			{
				issuer: ISSUER,
				subject: user._id,
				audience: user.email
			},
			RESETPASS_TOKEN_SECRET!,
			{
				algorithm: 'HS256',
				expiresIn: '1d'
			}
		)
	}

	async generateEmailToken(user: User): Promise<string> {
		return await sign(
			{
				issuer: ISSUER,
				subject: user._id,
				audience: user.email
			},
			EMAIL_TOKEN_SECRET!,
			{
				algorithm: 'HS256',
				expiresIn: '1d'
			}
		)
	}

	async tradeToken(email: string, password: string): Promise<string> {
		const user = await getMongoRepository(User).findOne({ email })

		if (user || (await user.matchesPassword(password))) {
			return this.generateToken(user)
		}

		throw new AuthenticationError('Login failed.')
	}

	async verifyToken(token: string): Promise<User> {
		let currentUser

		await verify(token, ACCESS_TOKEN_SECRET!, (err, data) => {
			if (err) {
				throw new AuthenticationError(
					'Authentication token is invalid, please log in.'
				)
			}

			currentUser = getMongoRepository(User).findOne({
				_id: data.subject
			})
		})

		return currentUser
	}
}
