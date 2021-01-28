import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { Position } from '@entities'
import { CreatePositionInput } from '../generator/graphql.schema'

@Resolver('Position')
export class PositionResolver {
	@Query()
	async positions(): Promise<Position[]> {
		return getMongoRepository(Position).find({
			cache: true
		})
	}

	@Mutation()
	async createPosition(
		@Args('input') input: CreatePositionInput
	): Promise<Position> {
		const { name } = input

		const position = await getMongoRepository(Position).findOne({ name })

		if (position) {
			throw new ForbiddenError('Position already existed.')
		}

		return await getMongoRepository(Position).save(new Position({ ...input }))
	}
}
