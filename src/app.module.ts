import { Module, CacheModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { GraphqlModule } from './config/graphql/graphql.module'
import { GraphqlService } from './config/graphql/graphql.service'
import { TypeormModule } from './config/typeorm/typeorm.module'
import { TypeormService } from './config/typeorm/typeorm.service'
import { CacheService } from './config/cache/cache.service'
import { UserModule } from './modules/user/user.module'
import { DataloaderModule } from './shared/dataloader/dataloader.module'
import { DishModule } from './modules/dish/dish.module'
import { SiteModule } from './modules/site/site.module'
import { PermissionModule } from './modules/permission/permission.module'
import { OrderService } from './modules/order/order.service';
import { OrderResolver } from './modules/order/order.resolver';
import { OrderModule } from './modules/order/order.module';
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
		GraphqlModule,
		TypeormModule,
		DataloaderModule,
		DishModule,
		SiteModule,
		PermissionModule,
		OrderModule
	],
	providers: [OrderService, OrderResolver]
})
export class AppModule {}
