import { Module } from '@nestjs/common'
import { TypeormService } from './typeorm.service'
import { ConfigModule } from '../envConfig/config.module'
import { AuthModule } from '../../auth/auth.module'

@Module({
	// imports: [ConfigModule, AuthModule],
	providers: [TypeormService]
})
export class TypeormModule {}
