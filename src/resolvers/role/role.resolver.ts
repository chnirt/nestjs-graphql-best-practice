import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository, getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'
import { Role, User, Node } from '../../models'
import { CreateRoleInput } from '../../generator/graphql.schema'

@Resolver('Role')
export class RoleResolver {
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: MongoRepository<Role>
	) {}

	@Query()
	async roles(): Promise<Role[]> {
		return this.roleRepository.find({
			cache: true
		})
	}

	@Mutation()
	async createRole(@Args('input') input: CreateRoleInput) {
		const { userId, path, name, permissions } = input

		const foundUser = await getMongoRepository(User).findOne({ _id: userId })

		if (!foundUser) {
			throw new ForbiddenError('User not found.')
		}

		const foundPath = await getMongoRepository(Node).findOne({ path })

		if (!foundPath) {
			throw new ForbiddenError('Node not found.')
		}

		if (permissions.length < 1) {
			throw new ForbiddenError('Permissions must be greater than 0.')
		}

		return await this.roleRepository.save(
			new Role({ ...input, permissions: [...input.permissions] })
		)
	}
}
