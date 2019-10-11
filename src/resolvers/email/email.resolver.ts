import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { Email } from '../../models'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { CreateEmailInput } from '../../generator/graphql.schema'
import { ApolloError } from 'apollo-server-core'

@Resolver('Email')
export class EmailResolver {
	constructor(
		@InjectRepository(Email)
		private readonly emailRepository: MongoRepository<Email>
	) {}

	@Query(() => [Email])
	async emails(): Promise<Email[]> {
		return this.emailRepository.find({
			cache: true
		})
	}

	@Mutation(() => Boolean)
	async createEmail(@Args('input') input: CreateEmailInput): Promise<boolean> {
		return this.emailRepository.save(new Email(input)) ? true : false
	}

	@Mutation(() => Boolean)
	async openEmail(@Args('_id') _id: string): Promise<boolean> {
		const email = await this.emailRepository.findOne({
			_id
		})

		if (!email) {
			throw new ApolloError('Not Found: Email', '404', {})
		}

		email.isOpened = true

		return this.emailRepository.save(email) ? true : false
	}
}
