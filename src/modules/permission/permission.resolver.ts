import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { PermissionService } from './permission.service'
import { Permission } from './permission.entity'
import { CreatePermissionInput, UpdatePermissionInput } from '../../graphql'
import { UserPermissionService } from '../userPermission/userPermission.service'

@Resolver('Permission')
export class PermissionResolver {
	constructor(private readonly permissionService: PermissionService) {}

	@Query(() => [Permission])
	async permissions() {
		return await this.permissionService.findAll()
	}

	@Query(() => Permission)
	async permission(@Args('_id') _id: string) {
		return await this.permissionService.findById(_id)
	}

	@Mutation(() => Permission)
	async createPermission(@Args('input') input: CreatePermissionInput) {
		return await this.permissionService.create(input)
	}

	@Mutation(() => Boolean)
	async updatePermission(
		@Args('_id') _id: string,
		@Args('input') input: UpdatePermissionInput
	) {
		return await this.permissionService.update(_id, input)
	}

	@Mutation(() => Boolean)
	async deletePermission(@Args('_id') _id: string) {
		return await this.permissionService.delete(_id)
	}

	@Mutation(() => Boolean)
	async deletePermissions() {
		return await this.permissionService.deleteAll()
	}
}
