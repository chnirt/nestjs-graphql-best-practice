import { Module } from '@nestjs/common'
import { HistoryResolver } from './history.resolver'
import { HistoryService } from './history.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { History } from './history.entity'

@Module({
	imports: [TypeOrmModule.forFeature([History])],
	providers: [HistoryResolver, HistoryService]
})
export class HistoryModule {}
