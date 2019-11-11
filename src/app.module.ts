import { Module, CacheModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'

import { AppController } from './app.controller'
import { CacheService, TypeormService, GraphqlService } from './config'
import { DateScalar } from './config/graphql/scalars/date.scalar'
import { UploadScalar } from './config/graphql/scalars/upload.scalar'

import {
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
	PositionResolver,
} from './resolvers'

@Module({
	imports: [
		GraphQLModule.forRootAsync({
			useClass: GraphqlService,
		}),
		TypeOrmModule.forRootAsync({
			useClass: TypeormService,
		}),
		CacheModule.registerAsync({
			useClass: CacheService,
		}),
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
		PositionResolver,
	],
})
export class AppModule {}

// const a = [1,2]
// const b = [3,4]

// const c = [1,2, ...b]
// const d = [1,2,3,4]
