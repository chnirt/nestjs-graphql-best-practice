import { Injectable, Options } from '@nestjs/common'
import { BullOptionsFactory, BullModuleOptions } from '@nestjs/bull'

@Injectable()
export class BullConfigService implements BullOptionsFactory {
	createBullOptions(): BullModuleOptions {
		return {
			redis: {
				host: 'localhost',
				port: 6379
			}
		}
	}
}
