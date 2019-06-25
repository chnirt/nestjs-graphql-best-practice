import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { GraphqlService } from './graphql.service';
import { UserService } from '../user/user.service';

@Module({
  // imports: [TypeOrmModule.forFeature([User])],
  providers: [GraphqlService],
})
export class GraphqlModule {}
