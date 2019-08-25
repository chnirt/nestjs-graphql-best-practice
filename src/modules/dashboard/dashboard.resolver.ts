import {
	Resolver,
	Query,
	Mutation,
	Args,
	ResolveProperty,
	Parent
} from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { Dashboard } from './dashboard.entity'
import { MongoRepository } from 'typeorm'
import * as GraphQLJSON from 'graphql-type-json'

@Resolver('Dashboard')
export class DashboardResolver {
	constructor(
		@InjectRepository(Dashboard)
		private readonly dashboardRepository: MongoRepository<Dashboard>
	) {}

	@Query(() => [Dashboard])
	async dashboards(): Promise<Dashboard[]> {
		return await this.dashboardRepository.find({
			order: { createdAt: 'DESC' },
			cache: true
		})
	}

	@Mutation(() => Dashboard)
	async createDashboard(@Args('data') data: GraphQLJSON): Promise<Dashboard> {
		const dashboard = new Dashboard()

		dashboard.data = JSON.stringify(data)

		return await this.dashboardRepository.save(dashboard)
	}

	@ResolveProperty(() => GraphQLJSON)
	async data(@Parent() dashboard: Dashboard): Promise<GraphQLJSON> {
		const { data } = dashboard
		return await JSON.parse(data)
	}
}
