import { Module } from '@nestjs/common'
import { HistoryResolver } from './history.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { History } from '../../models/history.entity'

@Module({
	imports: [TypeOrmModule.forFeature([History])],
	providers: [HistoryResolver],
	exports: [HistoryResolver]
})
export class HistoryModule {}
