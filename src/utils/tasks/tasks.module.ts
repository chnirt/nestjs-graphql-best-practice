import { Module } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { ConfigModule } from './../../config/envConfig/config.module'

@Module({
	imports: [ConfigModule],
	providers: [TasksService],
	exports: [TasksService]
})
export class TasksModule {}
