import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DashboardResolver } from './dashboard.resolver'
import { Dashboard } from '../../models/dashboard.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Dashboard])],
	providers: [DashboardResolver]
})
export class DashboardModule {}
