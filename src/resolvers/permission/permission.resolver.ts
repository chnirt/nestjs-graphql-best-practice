import { Resolver, Query } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { Permission } from '../../models/permission.entity'

@Resolver('Permission')
export class PermissionResolver {
	constructor(
		@InjectRepository(Permission)
		private readonly permissionRepository: MongoRepository<Permission>
	) {}

	@Query(() => [Permission])
	async permissions(): Promise<Permission[]> {
		return await this.permissionRepository.find({
			cache: true
		})
	}
}
