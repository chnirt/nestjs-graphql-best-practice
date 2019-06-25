import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  providers: [CacheService]
})
export class CacheModule {}
