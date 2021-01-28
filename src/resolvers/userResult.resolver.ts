import { Resolver, ResolveField } from '@nestjs/graphql'

@Resolver('UserResult')
export class UserResultResolver {
	@ResolveField()
	__resolveType(obj) {
		if (obj.email) {
			return 'User'
		}
		if (obj.users) {
			return 'Users'
		}
		return null
	}
}
