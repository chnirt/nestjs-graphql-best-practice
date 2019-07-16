import {
	Resolver,
	Query,
	Mutation,
	Args,
	ResolveProperty
} from '@nestjs/graphql'
import { UserPermissionService } from './userPermission.service'
import { UserPermission } from './userPermission.entity'
import {
	CreateUserPermissionInput,
	UpdateUserPermissionInput
} from '../../graphql'
import { forwardRef, Inject } from '@nestjs/common'
import { PermissionService } from '../permission/permission.service'
import { Permission } from '../permission/permission.entity'
import { PermissionInfo } from '../common/entities/interface.entity'

@Resolver('UserPermission')
export class UserPermissionResolver {
	constructor(private readonly userPermissionService: UserPermissionService) {}

	@Query(() => [UserPermission])
	async userPermissions() {
		return await this.userPermissionService.findAll()
	}

	// @ResolveProperty('permissions')
	// async getPermissions(userPermission): Promise<Permission[]> {
	// 	return await this.permissionService.findPermissionsByUserPermissionId(
	// 		userPermission._id
	// 	)
	// }

	@Query(() => [UserPermission])
	async findAllByUserId(@Args('_id') _id: string) {
		return await this.userPermissionService.findAllByUserId(_id)
	}

	@Query(() => UserPermission)
	async findOneByUserId(@Args('_id') _id: string) {
		return await this.userPermissionService.findOneByUserId(_id)
	}

	@Mutation(() => UserPermission)
	async createUserPermission(@Args('input') input: CreateUserPermissionInput) {
		return await this.userPermissionService.create(input)
	}

	@Mutation(() => UserPermission)
	async updateUserPermission(
		@Args('_id') _id: string,
		@Args('input') input: UpdateUserPermissionInput
	) {
		return await this.userPermissionService.update(_id, input)
	}

	@Mutation(() => Boolean)
	async deleteUserPermission(@Args('_id') _id: string) {
		return await this.userPermissionService.delete(_id)
	}

	@Mutation(() => Boolean)
	async deleteUserPermissions() {
		return await this.userPermissionService.deleteAll()
	}
}
