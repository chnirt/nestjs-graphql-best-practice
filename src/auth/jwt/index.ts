import { sign, verify } from 'jsonwebtoken'
import { getMongoRepository } from 'typeorm'
import { AuthenticationError, ForbiddenError } from 'apollo-server-core'

import { User } from '@models'
import { LoginResponse } from '../../generator/graphql.schema'

import {
	ISSUER,
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET,
	RESETPASS_TOKEN_SECRET,
	EMAIL_TOKEN_SECRET,
} from '@environments'

/**
 * Returns access token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param user - 1st input number
 * @returns The access token mean of `user`
 *
 * @beta
 */
export const generateToken = async (user: User): Promise<string> => {
	return await sign(
		{
			issuer: ISSUER!,
			subject: user._id,
		},
		ACCESS_TOKEN_SECRET!,
		{
			algorithm: 'HS256',
			expiresIn: '30d', // 15m
		}
	)
}

/**
 * Returns refresh token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param user - 1st input number
 * @returns The refresh token mean of `user`
 *
 * @beta
 */
export const generateRefreshToken = async (user: User): Promise<string> => {
	return await sign(
		{
			issuer: ISSUER!,
			subject: user._id,
		},
		REFRESH_TOKEN_SECRET!,
		{
			algorithm: 'HS256',
			expiresIn: '7d',
		}
	)
}

/**
 * Returns reset password token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param user - 1st input number
 * @returns The reset password token mean of `user`
 *
 * @beta
 */
export const generateResetPassToken = async (user: User): Promise<string> => {
	return await sign(
		{
			issuer: ISSUER!,
			subject: user._id,
		},
		RESETPASS_TOKEN_SECRET!,
		{
			algorithm: 'HS256',
			expiresIn: '1d',
		}
	)
}

/**
 * Returns email token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param user - 1st input number
 * @returns The email token mean of `user`
 *
 * @beta
 */
export const generateEmailToken = async (user: User): Promise<string> => {
	return await sign(
		{
			issuer: ISSUER!,
			subject: user._id,
		},
		EMAIL_TOKEN_SECRET!,
		{
			algorithm: 'HS256',
			expiresIn: '1d',
		}
	)
}

/**
 * Returns login response by trade token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param user - 1st input number
 * @returns The login response mean of `user`
 *
 * @beta
 */
export const tradeToken = async (user: User): Promise<LoginResponse> => {
	if (!user.isVerified) {
		throw new ForbiddenError('Please verify your email.')
	}

	if (!user.isActive) {
		throw new ForbiddenError('User already doestn\'t exist.')
	}

	if (user.isLocked) {
		throw new ForbiddenError('Your email has been locked.')
	}

	const accessToken = await generateToken(user)
	const refreshToken = await generateRefreshToken(user)

	return { accessToken, refreshToken }
}

/**
 * Returns user by verify token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param token - 1st input number
 * @returns The user mean of `token`
 *
 * @beta
 */
export const verifyToken = async (token: string): Promise<User> => {
	let currentUser

	await verify(token, ACCESS_TOKEN_SECRET!, async (err, data) => {
		if (err) {
			throw new AuthenticationError(
				'Authentication token is invalid, please try again.'
			)
		}

		currentUser = await getMongoRepository(User).findOne({
			_id: data.subject,
		})
	})

	if (!currentUser.isVerified) {
		throw new ForbiddenError('Please verify your email.')
	}

	return currentUser
}

/**
 * Returns user by verify refresh token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param token - 1st input number
 * @returns The user mean of `token`
 *
 * @beta
 */
export const verifyRefreshToken = async (token: string): Promise<User> => {
	let currentUser

	await verify(token, REFRESH_TOKEN_SECRET!, async (err, data) => {
		if (err) {
			throw new AuthenticationError(
				'Authentication token is invalid, please try again.'
			)
		}

		currentUser = await getMongoRepository(User).findOne({
			_id: data.subject,
		})
	})

	return currentUser
}

/**
 * Returns user by verify email token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param token - 1st input number
 * @returns The user mean of `token`
 *
 * @beta
 */
export const verifyEmailToken = async (token: string): Promise<User> => {
	let currentUser

	await verify(token, EMAIL_TOKEN_SECRET!, async (err, data) => {
		if (err) {
			throw new AuthenticationError(
				'Authentication token is invalid, please try again.'
			)
		}

		currentUser = await getMongoRepository(User).findOne({
			_id: data.subject,
		})
	})

	return currentUser
}
