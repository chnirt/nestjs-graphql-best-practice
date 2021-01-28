import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { Department } from '@entities'
import { CreateDepartmentInput } from '../generator/graphql.schema'

@Resolver('Department')
export class DepartmentResolver {
	@Query()
	async departments(): Promise<Department[]> {
		return getMongoRepository(Department).find({
			cache: true
		})
	}

	@Mutation()
	async createDepartment(
		@Args('input') input: CreateDepartmentInput
	): Promise<Department> {
		const { name } = input

		const department = await getMongoRepository(Department).findOne({ name })

		if (department) {
			throw new ForbiddenError('Department already existed.')
		}

		return await getMongoRepository(Department).save(
			new Department({ ...input })
		)
	}
}
