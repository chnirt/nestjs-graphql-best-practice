import { sign, verify } from 'jsonwebtoken'
import { getMongoRepository } from 'typeorm'
import { AuthenticationError, ForbiddenError } from 'apollo-server-core'

import { User } from '../models'
import { comparePassword } from '../utils/password'
import { LoginResponse } from '../generator/graphql.schema'

import {
	ISSUER,
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET,
	RESETPASS_TOKEN_SECRET,
	EMAIL_TOKEN_SECRET
} from '../environments'

export const generateToken = async (user: User): Promise<string> => {
	return await sign(
		{
			issuer: ISSUER,
			subject: user._id,
			audience: user.email
		},
		ACCESS_TOKEN_SECRET!,
		{
			algorithm: 'HS256',
			expiresIn: '30d' // 15m
		}
	)
}

export const generateRefreshToken = async (user: User): Promise<string> => {
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

export const generateResetPassToken = async (user: User): Promise<string> => {
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

export const generateEmailToken = async (user: User): Promise<string> => {
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

export const tradeToken = async (
	email: string,
	password: string
): Promise<LoginResponse> => {
	const user = await getMongoRepository(User).findOne({ email })

	if (!user) {
		// tslint:disable-next-line:quotemark
		throw new ForbiddenError("User already doestn't exist.")
	}

	if (user && (await comparePassword(password, user.password))) {
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

		const accessToken = await generateToken(user)
		const refreshToken = await generateRefreshToken(user)

		return { accessToken, refreshToken }
	}

	throw new AuthenticationError('Login failed.')
}

export const verifyToken = async (token: string): Promise<User> => {
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

export const verifyRefreshToken = async (token: string): Promise<User> => {
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

export const verifyEmailToken = async (token: string): Promise<User> => {
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

export const refreshToken = async (refreshToken: string): Promise<string> => {
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
