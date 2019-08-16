import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { History } from './history.entity'
import { CreateHistoryInput } from '../../graphql'

@Resolver('History')
export class HistoryResolver {
	constructor(
		@InjectRepository(History)
		private readonly historyRepository: MongoRepository<History>
	) {}

	@Query(() => [History])
	async histories() {
		return await this.historyRepository.find({
			cache: true
		})
	}

	@Mutation(() => History)
	async createHistory(@Args('input') input: CreateHistoryInput) {
		const { userId, description } = input

		const history = new History()
		history.userId = userId
		history.description = description

		return await this.historyRepository.save(history)
	}
}
