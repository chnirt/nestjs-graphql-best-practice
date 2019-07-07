import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { History } from './history.entity'
import { MongoRepository } from 'typeorm'
import { CreateHistoryInput } from '../../graphql'

@Injectable()
export class HistoryService {
	constructor(
		@InjectRepository(History)
		private readonly historyRepository: MongoRepository<History>
	) {}

	async findAll(): Promise<History[]> {
		return await this.historyRepository.find({
			cache: true
		})
	}

	async create(input: CreateHistoryInput): Promise<History> {
		const { userId, description } = input

		const history = new History()
		history.userId = userId
		history.description = description

		return await this.historyRepository.save(history)
	}

	async deleteAll(): Promise<boolean> {
		return (await this.historyRepository.deleteMany({})) ? true : false
	}
}
