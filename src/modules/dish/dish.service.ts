import { Injectable } from '@nestjs/common'
import { CommonService } from '../common/services/common.service'
import { Dish } from './dish.entity'
import { ApolloError } from 'apollo-server-core'

@Injectable()
export class DishService {
	constructor(private readonly commonService: CommonService) {}

	async dish(id: string): Promise<Dish | ApolloError> {
		try {
			return await this.commonService.findOneAdapter(Dish, { _id: id })
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async dishesByShop(shopId: string): Promise<Dish[] | ApolloError> {
		try {
			return await this.commonService.findAdapter(Dish, {
				shopId,
				isActive: true
			})
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async createDish(
		name: string,
		shopId: string
	): Promise<boolean | ApolloError> {
		try {
			return (await this.commonService.createAdapter(Dish, { name, shopId }))
				? true
				: false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async deleteDish(id: string): Promise<boolean | ApolloError> {
		try {
			return (await this.commonService.updateOneByIdAdapter(Dish, id, {
				$set: { isActive: false }
			}))
				? true
				: false
		} catch (error) {
			throw new ApolloError(error)
		}
	}
}
