import { Module } from '@nestjs/common';
import { SiteResolver } from './site.resolver';
import { SiteService } from './site.service';

@Module({
  providers: [SiteResolver, SiteService]
})
export class SiteModule {}
