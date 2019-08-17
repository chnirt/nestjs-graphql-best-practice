import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { getMetadataArgsStorage } from 'typeorm'
import * as dotenv from 'dotenv'

dotenv.config()
import config from '../../config.env'

// COMPLETE:
@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
	async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
		return process.env.NODE_ENV === 'testing'
			? {
					type: 'mongodb',
					url: 'mongodb://admin:chnirt1803@ds347467.mlab.com:47467/nest-graphql',
					entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
					synchronize: true,
					useNewUrlParser: true,
					logging: true
			  }
			: {
					type: 'mongodb',
					...config.orm,
					entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
					synchronize: true,
					useNewUrlParser: true,
					logging: true
			  }
	}
}
