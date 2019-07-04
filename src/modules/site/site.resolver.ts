import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { Site } from './site.entity'
import { SiteService } from './site.service'
import { CreateSiteInput, UpdateSiteInput } from '../../graphql'

@Resolver('Site')
export class SiteResolver {
	constructor(private readonly siteService: SiteService) {}

	@Query(() => [Site])
	async sites() {
		return await this.siteService.findAll()
	}

	@Query(() => Site)
	async site(@Args('_id') _id: string) {
		return await this.siteService.findById(_id)
	}

	@Mutation(() => Site)
	async createSite(@Args('input') input: CreateSiteInput) {
		return await this.siteService.create(input)
	}

	@Mutation(() => Site)
	async updateSite(
		@Args('_id') _id: string,
		@Args('input') input: UpdateSiteInput
	) {
		return await this.siteService.update(_id, input)
	}

	@Mutation(() => Boolean)
	async deleteSite(@Args('_id') _id: string) {
		return await this.siteService.delete(_id)
	}

	@Mutation(() => Boolean)
	async deleteSites() {
		return await this.siteService.deleteAll()
	}
}
