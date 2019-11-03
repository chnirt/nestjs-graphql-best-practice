import { Resolver, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'

import { Permission } from '@models'

@Resolver('Permission')
export class PermissionResolver {
	@Query()
	async permissions(): Promise<Permission[]> {
		return getMongoRepository(Permission).find({
			cache: true
		})
	}
}
