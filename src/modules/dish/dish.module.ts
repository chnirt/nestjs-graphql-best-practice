import { Module } from '@nestjs/common'
import { DishResolver } from './dish.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Dish } from './dish.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Dish])],
  providers: [DishResolver]
})
export class DishModule {}
