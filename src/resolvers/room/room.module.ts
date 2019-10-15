import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Room } from '../../models/room.entity'
import { RoomResolver } from './room.resolver'

@Module({
	imports: [TypeOrmModule.forFeature([Room])],
	providers: [RoomResolver]
})
export class RoomModule {}
