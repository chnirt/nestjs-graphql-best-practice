import { Module, Global } from '@nestjs/common'
import { SiteResolver } from './site.resolver'
import { SiteService } from './site.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Site } from './site.entity'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Site])],
	providers: [SiteResolver, SiteService],
	exports: [SiteService]
})
export class SiteModule {}
