import { Module } from '@nestjs/common'
import { MulterService } from './multer.service'

@Module({
	providers: [MulterService]
})
export class MulterModule {}
