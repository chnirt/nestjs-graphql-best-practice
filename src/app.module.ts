import { CacheModule, Module } from '@nestjs/common'
import { CacheService, GraphqlService, TypeormService } from './config'

import { AppController } from './app.controller'
import { AuthResolver } from './resolvers/auth.resolver'
import { DateScalar } from './config/graphql/scalars/date.scalar'
import { EmailResolver } from './resolvers/email.resolver'
import { FileResolver } from './resolvers/file.resolver'
import { FormResolver } from './resolvers/form.resolver'
import { GraphQLModule } from '@nestjs/graphql'
import { MessageResolver } from './resolvers/message.resolver'
import { NodeResolver } from './resolvers/node.resolver'
import { NotificationResolver } from './resolvers/notification.resolver'
import { PermissionResolver } from './resolvers/permission.resolver'
import { ResultResolver } from './resolvers/result.resolver'
import { RoleResolver } from './resolvers/role.resolver'
import { RoomResolver } from './resolvers/room.resolver'
import { TranslateResolver } from './resolvers/translate.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadScalar } from './config/graphql/scalars/upload.scalar'
import { UserResolver } from './resolvers/user.resolver'
import { UserResultResolver } from './resolvers/userResult.resolver'

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
		TranslateResolver
	]
})
export class AppModule {}
