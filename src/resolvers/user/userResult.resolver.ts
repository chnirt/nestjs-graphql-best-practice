import { Resolver, ResolveProperty } from '@nestjs/graphql'

@Resolver('UserResult')
export class UserResultResolver {
	@ResolveProperty()
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
