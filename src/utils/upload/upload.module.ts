import { Module } from '@nestjs/common'
import { UploadResolver } from './upload.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from './upload.entity'

@Module({
	imports: [TypeOrmModule.forFeature([File])],
	providers: [UploadResolver]
})
export class UploadModule {}
