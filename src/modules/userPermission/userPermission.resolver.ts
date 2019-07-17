import {
	Resolver,
	Query,
	Mutation,
	Args,
	ResolveProperty,
	Parent
} from '@nestjs/graphql'
import { UserPermissionService } from './userPermission.service'
import { UserPermission } from './userPermission.entity'
import {
	CreateUserPermissionInput,
	UpdateUserPermissionInput
} from '../../graphql'
import { SiteService } from '../site/site.service'

@Resolver('UserPermission')
export class UserPermissionResolver {
	constructor(
		private readonly userPermissionService: UserPermissionService,
		private readonly siteService: SiteService
	) {}

	@Query(() => [UserPermission])
	async userPermissions() {
		return await this.userPermissionService.findAll()
	}

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

	@ResolveProperty()
	async siteName(@Parent() userPermission) {
		// console.log(userPermission)
		const { siteId } = userPermission

		const site = await this.siteService.findById(siteId)

		return site.name
	}
}
