import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Notification } from '../../models/notification.entity'
import { NotificationResolver } from './notification.resolver'

@Module({
	imports: [TypeOrmModule.forFeature([Notification])],
	providers: [NotificationResolver]
})
export class NotificationModule {}
