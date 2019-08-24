import { Injectable } from '@nestjs/common'
import {
	MulterOptionsFactory,
	MulterModuleOptions
} from '@nestjs/platform-express'

// COMPLETE:
@Injectable()
export class MulterService implements MulterOptionsFactory {
	createMulterOptions(): MulterModuleOptions {
		return {
			dest: '/uploads'
		}
	}
}
