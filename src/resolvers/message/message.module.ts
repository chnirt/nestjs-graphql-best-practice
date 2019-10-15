import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Message } from '../../models/message.entity'
import { MessageResolver } from './message.resolver'

@Module({
	imports: [TypeOrmModule.forFeature([Message])],
	providers: [MessageResolver]
})
export class MessageModule {}
