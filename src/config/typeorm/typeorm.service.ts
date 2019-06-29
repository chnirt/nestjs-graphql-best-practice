import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { getMetadataArgsStorage } from 'typeorm'

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
	async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
		return {
			type: 'mongodb',
			url: 'mongodb://chnirt:chin04071803@ds055690.mlab.com:55690/nest-graphql',
			entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
			// entities: [User],
			// entities: [__dirname + '/**/*.entity.ts'],
			synchronize: true,
			useNewUrlParser: true,
			logging: true
		}
	}
}
