import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { HistoryService } from './history.service'
import { History } from './history.entity'
import { CreateHistoryInput } from '../../graphql'

@Resolver('History')
export class HistoryResolver {
	constructor(private readonly historyService: HistoryService) {}

	@Query(() => [History])
	async histories() {
		return await this.historyService.findAll()
	}

	@Mutation(() => History)
	async createHistory(@Args('input') input: CreateHistoryInput) {
		return await this.historyService.create(input)
	}

	@Mutation(() => Boolean)
	async deleteHistories() {
		return await this.historyService.deleteAll()
	}
}
