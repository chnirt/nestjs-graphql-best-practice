import {
	Resolver,
	Query,
	Mutation,
	Args,
	ResolveProperty,
	Parent,
	Context
} from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import * as GraphQLJSON from 'graphql-type-json'
import { Dashboard, User } from '../../models'

@Resolver('Dashboard')
export class DashboardResolver {
	constructor(
		@InjectRepository(Dashboard)
		private readonly dashboardRepository: MongoRepository<Dashboard>
	) {}

	@Query(() => [Dashboard])
	async dashboards(): Promise<Dashboard[]> {
		return this.dashboardRepository.find({
			order: { createdAt: 'DESC' },
			cache: true
		})
	}

	@Mutation(() => Dashboard)
	async createDashboard(
		@Args('data') data: GraphQLJSON,
		@Context('currentUser') currentUser: User
	): Promise<Dashboard> {
		const dashboard = new Dashboard()

		dashboard.userId = currentUser._id
		dashboard.data = JSON.stringify(data)

		return this.dashboardRepository.save(dashboard)
	}

	@ResolveProperty(() => GraphQLJSON)
	async data(@Parent() dashboard: Dashboard): Promise<GraphQLJSON> {
		const { data } = dashboard
		return JSON.parse(data)
	}
}
