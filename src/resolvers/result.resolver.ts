import { Resolver, ResolveProperty } from '@nestjs/graphql'

@Resolver('Result')
export class ResultResolver {
	@ResolveProperty()
	__resolveType(obj, context, info) {
		if (obj.email) {
			return 'User'
		}
		if (obj.filename) {
			return 'File'
		}
		return null
	}
}
