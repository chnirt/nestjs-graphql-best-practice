import { Resolver, ResolveProperty } from '@nestjs/graphql'

@Resolver()
export class ResultResolver {
	@ResolveProperty('Result')
	__resolveType(obj, context, info) {
		if (obj.email) {
			return 'User'
		}
		if (obj.name) {
			return 'File'
		}
		return null
	}
}
