import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { getMetadataArgsStorage } from 'typeorm'
import config from '../../config.env'

// COMPLETE:
@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
	async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
		return {
			...config.orm,
			type: 'mongodb',
			entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
			synchronize: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			logging: true
		}
	}
}
