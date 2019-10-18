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

	@Query(() => [Form])
	async forms(): Promise<Form[]> {
		return this.formRepository.find({
			cache: true
		})
	}

	@Mutation(() => Form)
	async createForm(@Args('input') input: CreateFormInput): Promise<Form> {
		console.log('a')
		return await this.formRepository.save(new Form(input))
	}
}
