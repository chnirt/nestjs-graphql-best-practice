import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { ApolloError } from 'apollo-server-core'
import { SiteShop } from '../../models'
import { SiteShopResponse } from '../../graphql'

@Resolver('siteShop')
export class SiteShopResolver {
	constructor(
		@InjectRepository(SiteShop)
		private readonly siteShopRepository: MongoRepository<SiteShop>
	) {}

	@Query('siteShopsBySiteId')
	async getSiteShopsBySiteId(
		@Args('siteId') siteId: string
	): Promise<SiteShopResponse[]> {
		try {
			return await this.siteShopRepository
				.aggregate([
					{
						$match: {
							siteId
						}
					},
					{
						$lookup: {
							from: 'shop',
							let: { id: '$shopId' },
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: ['$_id', '$$id']
										}
									}
								},
								{
									$project: { name: 1, _id: 0 }
								}
							],
							as: 'shop'
						}
					},
					{
						$project: {
							siteId: 1,
							shopId: 1,
							name: { $arrayElemAt: ['$shop.name', 0] }
						}
					},
					{
						$unwind: {
							path: '$shop',
							preserveNullAndEmptyArrays: true
						}
					}
				])
				.toArray()
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation('createSiteShop')
	async createSiteShop(
		@Args('siteId') siteId: string,
		@Args('shopId') shopId: string
	): Promise<boolean> {
		try {
			return (await this.siteShopRepository.save(
				new SiteShop({ siteId, shopId })
			))
				? true
				: false
		} catch (error) {
			throw new ApolloError(error)
		}
	}
}
