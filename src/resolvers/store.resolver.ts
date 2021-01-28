import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { Store } from '@entities'
import { CreateStoreInput } from '../generator/graphql.schema'

@Resolver('Store')
export class StoreResolver {
	@Query()
	async stores(): Promise<Store[]> {
		return getMongoRepository(Store).find({
			cache: true
		})
	}

	@Mutation()
	async createStore(@Args('input') input: CreateStoreInput): Promise<Store> {
		const { name } = input

		const store = await getMongoRepository(Store).findOne({ name })

		if (store) {
			throw new ForbiddenError('Store already existed.')
		}

		return await getMongoRepository(Store).save(new Store({ ...input }))
	}
}
