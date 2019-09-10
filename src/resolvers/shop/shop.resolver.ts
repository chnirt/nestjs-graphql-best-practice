import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { ApolloError } from 'apollo-server-core'
import { Shop } from '../../models'

@Resolver('Shop')
export class ShopResolver {
	constructor(
		@InjectRepository(Shop)
		private readonly shopRepository: MongoRepository<Shop>
	) {}

	@Query('shops')
	async shops(): Promise<Shop[]> {
		try {
			return await this.shopRepository.find({
				where: { isActive: true },
				order: { createAt: 'DESC' }
			})
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Query('shop')
	async shop(@Args('id') id: string): Promise<Shop> {
		try {
			return await this.shopRepository.findOne({ _id: id })
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation('createShop')
	async createShop(@Args('name') name: string): Promise<boolean> {
		try {
			return (await this.shopRepository.save(new Shop({ name }))) ? true : false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation('deleteShop')
	async deleteShop(@Args('id') id: string): Promise<boolean> {
		try {
			const deletedShop = await this.shopRepository.findOneAndUpdate(
				{ _id: id },
				{ $set: { isActive: false } },
				{ returnOriginal: false }
			)
			return (await this.shopRepository.save(deletedShop.value)) ? true : false
		} catch (error) {
			throw new ApolloError(error)
		}
	}
}
