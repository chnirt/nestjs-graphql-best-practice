import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
import { AuthInput, AuthResponse } from '../../generator/graphql.schema'
import { authenticateGooglePlus } from '../../auth/passport'

@Resolver('Auth')
export class AuthResolver {
	@Mutation()
	async authGooglePlus(
		@Args('input') input: AuthInput,
		@Context() context: any
	): Promise<AuthResponse> {
		const { req, res } = context
		const { accessToken } = input

		req.body = {
			...req.body,
			access_token: accessToken
		}

		// req.params.access_token = accessToken

		const rs = await authenticateGooglePlus(req, res)

		console.log(rs)

		return null
	}
}
