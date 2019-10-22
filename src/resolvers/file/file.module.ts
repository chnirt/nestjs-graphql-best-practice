import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from '../../models/file.entity'
import { FileResolver } from './file.resolver'

@Module({
	imports: [TypeOrmModule.forFeature([File])],
	providers: [FileResolver],
	exports: [FileResolver]
})
export class FileModule {}
