import { Injectable, Logger } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { getMetadataArgsStorage, createConnection } from 'typeorm'

import config from '../../config.orm'
import { logger } from '../../common'

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
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
			reconnectTries: Infinity,
			synchronize: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			keepConnectionAlive: true,
			logging: true
		}
		createConnection(options)
			.then(data => {
				logger.info(data)
				Logger.log(`☁️  Database connected`, 'TypeORM')
			})
			.catch(err => {
				logger.error(err)
				Logger.error(`❌  Database connect error`, 'TypeORM')
			})

		return options
	}
}
