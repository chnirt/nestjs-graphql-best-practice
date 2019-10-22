import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Node } from '../../models/node.entity'
import { NodeResolver } from './node.resolver'

@Module({
	imports: [TypeOrmModule.forFeature([Node])],
	providers: [NodeResolver],
	exports: [NodeResolver]
})
export class NodeModule {}
