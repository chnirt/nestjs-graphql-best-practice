import { Module, CacheModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'

import { AppController } from './app.controller'
import { CacheService, TypeormService, GraphqlService } from './config'
import { DateScalar } from './config/graphql/scalars/date.scalar'
import { UploadScalar } from './config/graphql/scalars/upload.scalar'

import { UserResolver } from './resolvers/user.resolver'
import { ResultResolver } from './resolvers/result.resolver'
import { UserResultResolver } from './resolvers/userResult.resolver'
import { AuthResolver } from './resolvers/auth.resolver'
import { EmailResolver } from './resolvers/email.resolver'
import { FileResolver } from './resolvers/file.resolver'
import { PermissionResolver } from './resolvers/permission.resolver'
import { RoleResolver } from './resolvers/role.resolver'
import { NotificationResolver } from './resolvers/notification.resolver'
import { RoomResolver } from './resolvers/room.resolver'
import { MessageResolver } from './resolvers/message.resolver'
import { FormResolver } from './resolvers/form.resolver'
import { NodeResolver } from './resolvers/node.resolver'
import { TranslateResolver } from './resolvers/translate.resolver'

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
