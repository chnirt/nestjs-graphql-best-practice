import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { getMetadataArgsStorage } from 'typeorm'
import config from '../../config.orm'

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
	async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
		return {
			...config,
			type: 'mongodb',
			entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
			// migrations: ['src/modules/**/migration/*.ts'],
			// subscribers: ['src/modules/**/subscriber/*.ts'],
			// cli: {
			// 	entitiesDir: 'src/modules/**/entity',
			// 	migrationsDir: 'src/modules/**/migration',
			// 	subscribersDir: 'src/modules/**/subscriber'
			// },
			synchronize: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			keepConnectionAlive: true,
			logging: true
		}
	}
}
