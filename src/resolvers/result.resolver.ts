import { Resolver, ResolveField } from '@nestjs/graphql'

@Resolver('Result')
export class ResultResolver {
	@ResolveField()
	__resolveType(obj, context, info) {
		console.log(context, info)
		if (obj.email) {
			return 'User'
		}
		if (obj.filename) {
			return 'File'
		}
		return null
	}
}
