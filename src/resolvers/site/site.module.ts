import { Module, Global } from '@nestjs/common'
import { SiteResolver } from './site.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Site } from '../../models/site.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Site])],
	providers: [SiteResolver]
})
export class SiteModule {}
