import { Module, CacheModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'

import { AppController } from './app.controller'
import { GraphqlService } from './config/graphql/graphql.service'
import { TypeormService } from './config/typeorm/typeorm.service'
import { CacheService } from './config/cache/cache.service'
import { LoggerModule } from './config/logger/logger.module'
import { DateScalar } from './config/graphql/scalars/date.scalar'
import { UploadScalar } from './config/graphql/scalars/upload.scalar'

import { UserResolver } from './resolvers/user.resolver'
import { ResultResolver } from './resolvers/result.resolver'
import { UserResultResolver } from './resolvers/userResult.resolver'
import { AuthResolver } from './resolvers/auth.resolver'
import { EmailResolver } from './resolvers/email.resolver'
import { PermissionResolver } from './resolvers/permission.resolver'
import { RoleResolver } from './resolvers/role.resolver'
import { NotificationResolver } from './resolvers/notification.resolver'
import { RoomResolver } from './resolvers/room.resolver'
import { MessageResolver } from './resolvers/message.resolver'
import { FormResolver } from './resolvers/form.resolver'
import { NodeResolver } from './resolvers/node.resolver'
import { FileResolver } from './resolvers/file.resolver'

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
		}),
		LoggerModule
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
		NodeResolver
	]
})
export class AppModule {}
