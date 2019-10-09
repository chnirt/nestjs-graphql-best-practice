import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from '../../models/file.entity'
import { FileResolver } from './file.resolver'
import { UploadModule } from '../../shared/upload/upload.module'

@Module({
	imports: [TypeOrmModule.forFeature([File]), UploadModule],
	providers: [FileResolver]
})
export class FileModule {}
