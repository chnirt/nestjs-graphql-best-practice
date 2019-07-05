import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { getMetadataArgsStorage } from 'typeorm'

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
	async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
		return {
			type: 'mongodb',
			url: 'mongodb://admin:chnirt1803@ds347467.mlab.com:47467/nest-graphql',
			entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
			// entities: [User],
			// entities: [__dirname + '/**/*.entity.ts'],
			synchronize: true,
			useNewUrlParser: true,
			logging: true
		}
	}
}
