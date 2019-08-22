import { Module } from '@nestjs/common'
import { UploadResolver } from './upload.resolver'
import { UploadService } from './upload.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from './upload.entity'

@Module({
	imports: [TypeOrmModule.forFeature([File])],
	providers: [UploadResolver, UploadService]
})
export class UploadModule {}
