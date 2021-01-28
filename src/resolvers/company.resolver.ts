import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { Company } from '@entities'
import { CreateCompanyInput } from '../generator/graphql.schema'

@Resolver('Company')
export class CompanyResolver {
	@Query()
	async companies(): Promise<Company[]> {
		return getMongoRepository(Company).find({
			cache: true
		})
	}

	@Mutation()
	async createCompany(
		@Args('input') input: CreateCompanyInput
	): Promise<Company> {
		const { name } = input

		const company = await getMongoRepository(Company).findOne({ name })

		if (company) {
			throw new ForbiddenError('Company already existed.')
		}

		return await getMongoRepository(Company).save(new Company({ ...input }))
	}
}
