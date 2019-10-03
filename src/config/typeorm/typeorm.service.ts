import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { getMetadataArgsStorage } from 'typeorm'
import { ConfigService } from '../../config/envConfig/config.service'

// COMPLETE:
@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
	constructor(private readonly configService: ConfigService) {}
	async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
		return {
			...this.configService.get('orm'),
			type: 'mongodb',
			entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
			synchronize: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			logging: true
		}
	}
}
