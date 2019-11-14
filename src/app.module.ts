import {
	AuthResolver,
	CityResolver,
	CompanyResolver,
	DepartmentResolver,
	EmailResolver,
	FileResolver,
	FormResolver,
	MessageResolver,
	NodeResolver,
	NotificationResolver,
	PermissionResolver,
	PositionResolver,
	ResultResolver,
	RoleResolver,
	RoomResolver,
	StoreResolver,
	TranslateResolver,
	UserResolver,
	UserResultResolver
} from './resolvers'
import { CacheModule, Module } from '@nestjs/common'
import { CacheService, GraphqlService, TypeormService } from './config'

import { AppController } from './app.controller'
import { DateScalar } from './config/graphql/scalars/date.scalar'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadScalar } from './config/graphql/scalars/upload.scalar'

@Module({
	imports: [
		GraphQLModule.forRootAsync({
			useClass: GraphqlService
		}),
		TypeOrmModule.forRootAsync({
			useClass: TypeormService
		}),
		CacheModule.registerAsync({
			useClass: CacheService
		})
	],
	controllers: [AppController],
	providers: [
		DateScalar,
		UploadScalar,
		UserResolver,
		ResultResolver,
		UserResultResolver,
		AuthResolver,
		EmailResolver,
		FileResolver,
		PermissionResolver,
		RoleResolver,
		NotificationResolver,
		RoomResolver,
		MessageResolver,
		FormResolver,
		NodeResolver,
		TranslateResolver,
		CompanyResolver,
		CityResolver,
		StoreResolver,
		DepartmentResolver,
		PositionResolver
	]
})
export class AppModule {}

// const a = [1,2]
// const b = [3,4]

// const c = [1,2, ...b]
// const d = [1,2,3,4]
