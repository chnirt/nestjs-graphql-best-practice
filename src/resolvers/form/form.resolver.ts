import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { Form } from '../../models'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { CreateFormInput } from '../../generator/graphql.schema'
import { ForbiddenError } from 'apollo-server-core'

@Resolver('Form')
export class FormResolver {
	constructor(
		@InjectRepository(Form)
		private readonly formRepository: MongoRepository<Form>
	) {}

	@Query()
	async forms(): Promise<Form[]> {
		return this.formRepository.find({
			cache: true
		})
	}

	@Mutation()
	async createForm(@Args('input') input: CreateFormInput): Promise<Form> {
		// return await this.formRepository.save(new Form({ ...input }))
		return null
	}

	@Mutation()
	async acceptForm1st(@Args('_id') _id: string): Promise<Form> {
		const form = await this.formRepository.findOne({ _id, state: 0 })

		if (!form) {
			throw new ForbiddenError('Form not found.')
		}

		form.state = 10

		return await this.formRepository.save(form)
	}

	@Mutation()
	async acceptForm2nd(@Args('_id') _id: string): Promise<Form> {
		const form = await this.formRepository.findOne({ _id, state: 10 })

		if (!form) {
			throw new ForbiddenError('Form not found.')
		}

		form.state = 20

		return await this.formRepository.save(form)
	}
}
