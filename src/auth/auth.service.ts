import { Injectable } from '@nestjs/common'
import { getMongoRepository } from 'typeorm'
import { sign, verify } from 'jsonwebtoken'
import { AuthenticationError, ForbiddenError } from 'apollo-server-core'
import { User } from '../models/user.entity'
import { LoginResponse } from '../graphql.schema'

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

	async tradeToken(email: string, password: string): Promise<LoginResponse> {
		const user = await getMongoRepository(User).findOne({ email })

		if (!user) {
			// tslint:disable-next-line:quotemark
			throw new ForbiddenError("User already doestn't exist.")
		}

		if (user && (await user.matchesPassword(password))) {
			if (!user.isVerified) {
				throw new ForbiddenError('Please verify your email.')
			}

			if (!user.isActive) {
				// tslint:disable-next-line:quotemark
				throw new ForbiddenError("User already doestn't exist.")
			}

			if (user.isLocked) {
				throw new ForbiddenError('Your email has been locked.')
			}

			const accessToken = await this.generateToken(user)
			const refreshToken = await this.generateRefreshToken(user)

			return { accessToken, refreshToken }
		}

		throw new AuthenticationError('Login failed.')
	}

	async verifyToken(token: string): Promise<User> {
		let currentUser

		await verify(token, ACCESS_TOKEN_SECRET!, async (err, data) => {
			if (err) {
				throw new AuthenticationError(
					'Authentication token is invalid, please try again.'
				)
			}

			currentUser = await getMongoRepository(User).findOne({
				_id: data.subject
			})
		})

		if (!currentUser.isVerified) {
			throw new ForbiddenError('Please verify your email.')
		}

		return currentUser
	}

	async verifyRefreshToken(token: string): Promise<User> {
		let currentUser

		await verify(token, REFRESH_TOKEN_SECRET!, async (err, data) => {
			if (err) {
				throw new AuthenticationError(
					'Authentication token is invalid, please try again.'
				)
			}

			currentUser = await getMongoRepository(User).findOne({
				_id: data.subject
			})
		})

		return currentUser
	}

	async verifyEmailToken(token: string): Promise<User> {
		let currentUser

		await verify(token, EMAIL_TOKEN_SECRET!, async (err, data) => {
			if (err) {
				throw new AuthenticationError(
					'Authentication token is invalid, please try again.'
				)
			}

			currentUser = await getMongoRepository(User).findOne({
				_id: data.subject
			})
		})

		return currentUser
	}

	async refreshToken(refreshToken: string): Promise<string> {
		let currentUser

		await verify(refreshToken, REFRESH_TOKEN_SECRET!, (err, data) => {
			if (err) {
				throw new AuthenticationError(
					'Authentication token is invalid, please try again.'
				)
			}

			currentUser = getMongoRepository(User).findOne({
				_id: data.subject
			})
		})

		return currentUser
	}
}
