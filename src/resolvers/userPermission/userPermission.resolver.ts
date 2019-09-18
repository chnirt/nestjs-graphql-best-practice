import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { UserPermission } from '../../models'
import { CreateUserPermissionInput } from '../../graphql'

@Resolver('UserPermission')
export class UserPermissionResolver {
	constructor(
		@InjectRepository(UserPermission)
		private readonly userPermissionRepository: MongoRepository<UserPermission>
	) {}

	@Query(() => [UserPermission])
	async userPermissions() {
		return this.userPermissionRepository.find({
			cache: true
		})
	}

	@Query(() => [UserPermission])
	async findAllByUserId(@Args('_id') _id: string) {
		const message = 'UserPermission is not found.'

		const userPermission = await this.userPermissionRepository.find({
			userId: _id
		})

		if (!userPermission) {
			throw new Error(message)
		}

		return userPermission
	}

	@Mutation(() => UserPermission)
	async createUserPermission(@Args('input') input: CreateUserPermissionInput) {
		const { userId, siteId, permissions } = input

		const existedUserPermission = await this.userPermissionRepository.findOne({
			userId,
			siteId
		})

		if (existedUserPermission) {
			existedUserPermission.permissions = permissions

			return this.userPermissionRepository.save(existedUserPermission)
		} else {
			const userPermission = new UserPermission()
			userPermission.userId = userId
			userPermission.siteId = siteId
			userPermission.permissions = permissions

			return this.userPermissionRepository.save(userPermission)
		}
	}
}
