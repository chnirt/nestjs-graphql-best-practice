import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';

@Module({
  providers: [DataloaderService]
})
export class DataloaderModule {}
