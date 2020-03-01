import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'

@Processor('app')
export class AppProcessor {
	@Process('transcode')
	handleTranscode(job: Job) {
		Logger.log('Start transcoding...', 'Bull')
		Logger.log(job.data, 'Bull')
		Logger.log('Transcoding completed', 'Bull')
	}
}
