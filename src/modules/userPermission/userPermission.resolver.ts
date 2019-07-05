import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UserPermissionService } from './userpermission.service'
import { UserPermission } from './userPermission.entity'
import {
	CreateUserPermissionInput,
	UpdateUserPermissionInput
} from '../../graphql'
import { forwardRef, Inject } from '@nestjs/common'
import { PermissionService } from '../permission/permission.service'

@Resolver('UserPermission')
export class UserPermissionResolver {
	constructor(
		// @Inject(forwardRef(() => PermissionService))
		// private readonly permissionService: PermissionService,
		private readonly userPermissionService: UserPermissionService
	) {}

	@Query(() => [UserPermission])
	async userPermissions() {
		return await this.userPermissionService.findAll()
	}

	@Query(() => UserPermission)
	async userPermission(@Args('_id') _id: string) {
		return await this.userPermissionService.findById(_id)
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
