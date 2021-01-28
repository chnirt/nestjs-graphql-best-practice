import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { Email } from '@entities'
import { CreateEmailInput } from '../generator/graphql.schema'

@Resolver('Email')
export class EmailResolver {
	@Query()
	async emails(): Promise<Email[]> {
		return getMongoRepository(Email).find({
			cache: true
		})
	}

	@Mutation()
	async createEmail(@Args('input') input: CreateEmailInput): Promise<Email> {
		return await getMongoRepository(Email).save(new Email(input))
	}

	@Mutation()
	async openEmail(@Args('_id') _id: string): Promise<boolean> {
		const email = await getMongoRepository(Email).findOne({
			_id
		})

		if (!email) {
			throw new ForbiddenError('Email not found.')
		}

		email.isOpened = true

		return getMongoRepository(Email).save(email) ? true : false
	}
}
