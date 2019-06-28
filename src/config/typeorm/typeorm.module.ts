import { Module } from '@nestjs/common';
import { TypeormService } from './typeorm.service';

@Module({
  providers: [TypeormService]
})
export class TypeormModule {}
