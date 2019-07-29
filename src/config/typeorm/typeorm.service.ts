import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { getMetadataArgsStorage } from 'typeorm'

import config from '../../config.env'

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
	async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
		return {
			...config.orm,
			entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
			// entities: [User],
			// entities: [__dirname + '/**/*.entity.ts'],
			synchronize: true,
			useNewUrlParser: true,
			logging: true
		}
	}
}
