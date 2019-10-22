import { Resolver, Query } from '@nestjs/graphql'
import { Permission } from '../../models'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'

@Resolver('Permission')
export class PermissionResolver {
	constructor(
		@InjectRepository(Permission)
		private readonly permissionRepository: MongoRepository<Permission>
	) {}

	@Query(() => [Permission])
	async permissions(): Promise<Permission[]> {
		return this.permissionRepository.find({
			cache: true
		})
	}
}
