import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { Form } from '@entities'
import { CreateFormInput } from '../generator/graphql.schema'

@Resolver('Form')
export class FormResolver {
	@Query()
	async forms(): Promise<Form[]> {
		return getMongoRepository(Form).find({
			cache: true
		})
	}

	@Mutation()
	async createForm(@Args('input') input: CreateFormInput): Promise<Form> {
		return await getMongoRepository(Form).save(new Form({ ...input }))
	}

	@Mutation()
	async acceptForm1st(@Args('_id') _id: string): Promise<Form> {
		const form = await getMongoRepository(Form).findOne({ _id, state: 0 })

		if (!form) {
			throw new ForbiddenError('Form not found.')
		}

		form.state = 10

		return await getMongoRepository(Form).save(form)
	}

	@Mutation()
	async acceptForm2nd(@Args('_id') _id: string): Promise<Form> {
		const form = await getMongoRepository(Form).findOne({ _id, state: 10 })

		if (!form) {
			throw new ForbiddenError('Form not found.')
		}

		form.state = 20

		return await getMongoRepository(Form).save(form)
	}
}
