import { Module, CacheModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'

import { GraphqlService } from './config/graphql/graphql.service'
import { TypeormService } from './config/typeorm/typeorm.service'
import { CacheService } from './config/cache/cache.service'
import { LoggerModule } from './config/logger/logger.module'
import { UserModule } from './resolvers/user/user.module'
import { DateScalar } from './common/scalars/date.scalar'
import { UploadScalar } from './common/scalars/upload.scalar'
import { FileModule } from './resolvers/file/file.module'
import { EmailModule } from './resolvers/email/email.module'
import { NotificationModule } from './resolvers/notification/notification.module'
import { RoomModule } from './resolvers/room/room.module'
import { MessageModule } from './resolvers/message/message.module'
import { FormModule } from './resolvers/form/form.module'
import { NodeModule } from './resolvers/node/node.module'
import { PermissionModule } from './resolvers/permission/permission.module'
import { RoleModule } from './resolvers/role/role.module'

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
		UserModule,
		LoggerModule,
		FileModule,
		EmailModule,
		NotificationModule,
		RoomModule,
		MessageModule,
		FormModule,
		NodeModule,
		PermissionModule,
		RoleModule
	],
	providers: [DateScalar, UploadScalar]
})
export class AppModule {}
