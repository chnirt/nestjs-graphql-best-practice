import { Module } from '@nestjs/common'
import { ConfigService } from './config.service'

@Module({
	providers: [
		{
			provide: ConfigService,
			useValue: new ConfigService(`src/environments/index.ts`)
		}
	],
	exports: [ConfigService]
})
export class ConfigModule {}
