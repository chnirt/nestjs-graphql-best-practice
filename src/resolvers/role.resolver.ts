import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { Role, Node } from '@models'
import { CreateRoleInput } from '../generator/graphql.schema'

@Resolver('Role')
export class RoleResolver {
	@Query()
	async roles(): Promise<Role[]> {
		return getMongoRepository(Role).find({
			cache: true
		})
	}

	@Mutation()
	async createRole(@Args('input') input: CreateRoleInput) {
		const { name, nodeId, permissions } = input

		const node = await getMongoRepository(Node).findOne({ _id: nodeId })

		if (!node) {
			throw new ForbiddenError('Node not found.')
		}

		const role = await getMongoRepository(Role).findOne({ name, nodeId })

		if (role) {
			throw new ForbiddenError('Role already exists.')
		}

		if (permissions.length < 1) {
			throw new ForbiddenError('Permissions must be greater than 0.')
		}

		return await getMongoRepository(Role).save(
			new Role({ ...input, permissions: [...input.permissions] })
		)
	}
}
