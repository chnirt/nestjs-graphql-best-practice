import { Injectable, Logger } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import {
	getMetadataArgsStorage,
	createConnection,
	getConnection
} from 'typeorm'

import config from '../../config.orm'
// import { logger } from '../../common'

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
	async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
		const options = {
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
			autoLoadEntities: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			keepConnectionAlive: true,
			logging: true
		}
		return options
	}
}
