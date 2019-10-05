import { Injectable } from '@nestjs/common'
import { getMongoRepository } from 'typeorm'
import { sign, verify } from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-core'
import { User } from '../models/user.entity'

import { ISSUER, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../environments'

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

	// async generateRefreshToken(user: User): Promise<string> {
	// 	return await sign(
	// 		{
	// 			issuer: ISSUER,
	// 			subject: user._id,
	// 			audience: user.email
	// 		},
	// 		REFRESH_TOKEN_SECRET!,
	// 		{
	// 			algorithm: 'HS256',
	// 			expiresIn: '7d'
	// 		}
	// 	)
	// }

	async tradeToken(email: string, password: string): Promise<string> {
		const user = await getMongoRepository(User).findOne({ email })

		if (user || (await user.matchesPassword(password))) {
			return this.generateToken(user)
		}

		throw new AuthenticationError('Login failed.')
	}

	async verifyToken(token: string): Promise<User> {
		let currentUser
		let decodedToken

		await verify(token, ACCESS_TOKEN_SECRET!, (err, data) => {
			decodedToken = data
			if (err || !decodedToken) {
				throw new AuthenticationError('Authentication token is invalid, please log in.')
			}
		})

		currentUser = await getMongoRepository(User).findOne({
			_id: decodedToken.subject
		})

		return currentUser
	}
}
