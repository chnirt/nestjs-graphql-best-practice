import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ApolloError } from 'apollo-server-core'

import {
	AuthInput,
	LoginResponse,
	Gender
} from '../../generator/graphql.schema'
import { authenticateGooglePlus } from '../../auth/passport'
import { generateToken, generateRefreshToken } from '../../auth'
import { User } from '../../models'

@Resolver('Auth')
export class AuthResolver {
	@Mutation()
	async oauthGooglePlus(
		@Args('input') input: AuthInput,
		@Context() context: any
	): Promise<LoginResponse> {
		const { req, res } = context
		const { accessToken } = input

		req.body = {
			...req.body,
			access_token: accessToken
		}

		const { data, info } = await authenticateGooglePlus(req, res)

		if (data) {
			console.log(data)

			const { profile } = data

			let user

			user = await getMongoRepository(User).findOne({
				where: {
					'googleplus._id': profile.id
				}
			})

			// console.log(user)

			if (!user) {
				// add create User
				user = await getMongoRepository(User).save(
					new User({
						googleplus: {
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

			const accessToken = await generateToken(user)
			const refreshToken = await generateRefreshToken(user)

			return { accessToken, refreshToken }
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
