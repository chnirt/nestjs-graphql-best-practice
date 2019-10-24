import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { AuthInput, AuthResponse } from '../../generator/graphql.schema'
import { authenticateFacebook } from '../../auth/passport'
import { ForbiddenError } from 'apollo-server-core'

@Resolver('Auth')
export class AuthResolver {
	@Mutation()
	async authFacebook(
		@Args('input') input: AuthInput,
		@Context() context: any
	): Promise<AuthResponse> {
		const { req, res } = context
		const { accessToken } = input

		req.body = {
			...req.body,
			access_token: accessToken
		}

		console.log(req.body)

		return null
	}

	@Mutation()
	async authGoogle(
		@Args('input') input: AuthInput,
		@Context() context: any
	): Promise<AuthResponse> {
		const { req, res } = context
		const { accessToken } = input

		req.body = {
			...req.body,
			access_token: accessToken
		}

		return null
	}
}
