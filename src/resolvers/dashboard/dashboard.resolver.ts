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
import { Dashboard } from '../../models/dashboard.entity'
import { MongoRepository } from 'typeorm'
import * as GraphQLJSON from 'graphql-type-json'
import { User } from '../../models/user.entity'

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
	async createDashboard(
		@Args('data') data: GraphQLJSON,
		@Context('currentUser') currentUser: User
	): Promise<Dashboard> {
		const dashboard = new Dashboard()

		dashboard.userId = currentUser._id
		dashboard.data = JSON.stringify(data)

		return await this.dashboardRepository.save(dashboard)
	}

	@ResolveProperty(() => GraphQLJSON)
	async data(@Parent() dashboard: Dashboard): Promise<GraphQLJSON> {
		const { data } = dashboard
		return await JSON.parse(data)
	}
}
