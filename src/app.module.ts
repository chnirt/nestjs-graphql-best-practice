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
import { TasksModule } from './shared/tasks/tasks.module'
import { EmailModule } from './resolvers/email/email.module'
import { NotificationModule } from './resolvers/notification/notification.module'
import { RoomModule } from './resolvers/room/room.module'
import { MessageModule } from './resolvers/message/message.module'
import { FormModule } from './resolvers/form/form.module'
import { NodeModule } from './resolvers/node/node.module'

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
		TasksModule,
		EmailModule,
		NotificationModule,
		RoomModule,
		MessageModule,
		FormModule,
		NodeModule
	],
	providers: [DateScalar, UploadScalar]
})
export class AppModule {}
