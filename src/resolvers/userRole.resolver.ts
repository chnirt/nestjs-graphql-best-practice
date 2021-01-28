import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { UserRole, User, Role } from '@entities'
import { CreateUserRoleInput } from '../generator/graphql.schema'

@Resolver('UserRole')
export class UserRoleResolver {
	@Query()
	async userRoles(): Promise<UserRole[]> {
		return getMongoRepository(UserRole).find({
			cache: true
		})
	}

	@Mutation()
	async createUserRole(
		@Args('input') input: CreateUserRoleInput
	): Promise<UserRole> {
		const { userId, roleId } = input

		const user = await getMongoRepository(User).findOne({ _id: userId })

		if (!user) {
			throw new ForbiddenError('User not found.')
		}

		const role = await getMongoRepository(Role).findOne({ _id: roleId })

		if (!role) {
			throw new ForbiddenError('Role not found.')
		}

		const userRole = await getMongoRepository(UserRole).findOne({
			userId,
			roleId
		})

		if (userRole) {
			throw new ForbiddenError('UserRole already existed.')
		}

		return await getMongoRepository(UserRole).save(new UserRole({ ...input }))
	}
}
