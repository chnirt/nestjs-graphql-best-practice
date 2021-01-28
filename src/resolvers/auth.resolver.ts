import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ApolloError } from 'apollo-server-core'

import { LoginResponse, Gender } from '../generator/graphql.schema'
import {
	authenticateGooglePlus,
	authenticateFacebook,
	authenticateGoogle,
	tradeToken
} from '@auth'
import { User } from '@entities'

@Resolver('Auth')
export class AuthResolver {
	@Mutation()
	async oauthGooglePlus(
		@Args('accessToken') accessToken: string,
		@Context() context: any
	): Promise<LoginResponse> {
		const { req, res } = context

		req.body = {
			...req.body,
			access_token: accessToken
		}

		const { data, info } = await authenticateGooglePlus(req, res)

		if (data) {
			// console.log(data.profile)

			const { profile } = data

			let user

			user = await getMongoRepository(User).findOne({
				where: {
					'google._id': profile.id
				}
			})

			// console.log(user)

			if (!user) {
				// add create User
				user = await getMongoRepository(User).save(
					new User({
						google: {
							_id: profile.id,
							email: profile.emails[0].value
						},
						firstName: profile.name.givenName,
						lastName: profile.name.familyName,
						gender: Gender.UNKNOWN,
						avatar: profile.photos[0].value
					})
				)
			}

			return await tradeToken(user)
		}

		if (info) {
			// console.log(info)
			const { code } = info
			switch (code) {
				case 'ETIMEDOUT':
					throw new ApolloError('Failed to reach Google Plus: Try Again')
				default:
					throw new ApolloError('Something went wrong')
			}
		}
	}

	@Mutation()
	async oauthFacebook(
		@Args('accessToken') accessToken: string,
		@Context() context: any
	): Promise<LoginResponse> {
		const { req, res } = context

		req.body = {
			...req.body,
			access_token: accessToken
		}

		const { data, info } = await authenticateFacebook(req, res)

		if (data) {
			// console.log(data.profile)

			const { profile } = data

			let user

			user = await getMongoRepository(User).findOne({
				where: {
					'facebook._id': profile.id
				}
			})

			// console.log(user)

			if (!user) {
				// add create User
				user = await getMongoRepository(User).save(
					new User({
						facebook: {
							_id: profile.id,
							email: profile.emails[0].value
						},
						firstName: profile.name.givenName,
						lastName: profile.name.familyName,
						gender: profile.gender === '' && Gender.UNKNOWN,
						avatar: profile.photos[0].value
					})
				)
			}

			return await tradeToken(user)
		}

		if (info) {
			// console.log(info)
			const { code } = info
			switch (code) {
				case 'ETIMEDOUT':
					throw new ApolloError('Failed to reach Google: Try Again')
				default:
					throw new ApolloError('Something went wrong')
			}
		}
	}

	@Mutation()
	async oauthGoogle(
		@Args('accessToken') accessToken: string,
		@Context() context: any
	): Promise<LoginResponse> {
		const { req, res } = context

		req.body = {
			...req.body,
			access_token: accessToken
		}

		const { data, info } = await authenticateGoogle(req, res)

		if (data) {
			console.log(data.profile)

			const { profile } = data

			let user

			user = await getMongoRepository(User).findOne({
				where: {
					'google._id': profile.id
				}
			})

			// console.log(user)

			if (!user) {
				// add create User
				user = await getMongoRepository(User).save(
					new User({
						google: {
							_id: profile.id,
							email: profile.emails[0].value
						},
						firstName: profile.name.givenName,
						lastName: profile.name.familyName,
						gender: Gender.UNKNOWN,
						avatar: profile.photos ? profile.photos[0].value : ''
					})
				)
			}

			return await tradeToken(user)
		}

		if (info) {
			// console.log(info)
			const { code } = info
			switch (code) {
				case 'ETIMEDOUT':
					throw new ApolloError('Failed to reach Google: Try Again')
				default:
					throw new ApolloError('Something went wrong')
			}
		}
	}
}
