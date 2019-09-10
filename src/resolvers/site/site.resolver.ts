import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { Site } from '../../models'
import { CreateSiteInput, UpdateSiteInput } from '../../graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { ApolloError } from 'apollo-server-core'

@Resolver('Site')
export class SiteResolver {
	constructor(
		@InjectRepository(Site)
		private readonly siteRepository: MongoRepository<Site>
	) {}

	@Query(() => [Site])
	async sites(): Promise<Site[]> {
		return await this.siteRepository.find({
			cache: true
		})
	}

	@Query(() => [Site])
	async sitesByIds(@Args('ids') ids: string[]): Promise<Site[]> {
		const convertIds = await ids.map(item => {
			return {
				_id: item
			}
		})

		return await this.siteRepository.find({
			where: { $or: convertIds }
		})
	}

	@Query(() => Site)
	async site(@Args('_id') _id: string): Promise<Site> {
		const site = await this.siteRepository.findOne({ _id })

		if (!site) {
			throw new ApolloError('Not Found: Site', '404', {})
		}

		return site
	}

	@Mutation(() => Site)
	async createSite(@Args('input') input: CreateSiteInput): Promise<Site> {
		const { name } = input

		const site = new Site()
		site.name = name

		return await this.siteRepository.save(site)
	}

	@Mutation(() => Site)
	async updateSite(
		@Args('_id') _id: string,
		@Args('input') input: UpdateSiteInput
	): Promise<boolean> {
		const message = 'Site is not found.'
		const { name } = input

		const site = await this.siteRepository.findOne({ _id })

		if (!site) {
			throw new Error(message)
		}

		site.name = name

		return (await this.siteRepository.save(site)) ? true : false
	}

	@Mutation(() => Boolean)
	async deleteSite(@Args('_id') _id: string): Promise<boolean> {
		const message = 'Site is not found.'

		const site = await this.siteRepository.findOne({ _id })

		if (!site) {
			throw new Error(message)
		}

		return (await this.siteRepository.remove(site)) ? true : false
	}

	@Mutation(() => Boolean)
	async deleteSites(): Promise<boolean> {
		return (await this.siteRepository.deleteMany({})) ? true : false
	}
}
