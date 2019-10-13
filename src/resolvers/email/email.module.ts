import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Email } from '../../models/email.entity'
import { EmailResolver } from './email.resolver'

@Module({
	imports: [TypeOrmModule.forFeature([Email])],
	providers: [EmailResolver],
	exports: [EmailResolver]
})
export class EmailModule {}
