import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { City } from '@entities'
import { CreateCityInput } from '../generator/graphql.schema'

@Resolver('City')
export class CityResolver {
	@Query()
	async cities(): Promise<City[]> {
		return getMongoRepository(City).find({
			cache: true
		})
	}

	@Mutation()
	async createCity(@Args('input') input: CreateCityInput): Promise<City> {
		const { name } = input

		const city = await getMongoRepository(City).findOne({ name })

		if (city) {
			throw new ForbiddenError('City already existed.')
		}

		return await getMongoRepository(City).save(new City({ ...input }))
	}
}
