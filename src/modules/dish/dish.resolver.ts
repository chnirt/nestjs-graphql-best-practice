import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { Dish } from './dish.entity'
import { ApolloError } from 'apollo-server-core';

@Resolver('Dish')
export class DishResolver {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: MongoRepository<Dish>
  ) { }

  @Query('dish')
  async dish(@Args('id') id: string): Promise<Dish> {
    try {
      return await this.dishRepository.findOne({ _id: id })
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  @Query('dishesByShop')
  async dishesByShop(@Args('shopId') shopId: string): Promise<Dish[]> {
    try {
      return await this.dishRepository.find({ shopId, isActive: true })
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  @Mutation('createDish')
  async createDish(@Args('name') name: string, @Args('shopId') shopId: string): Promise<boolean> {
    try {
      return await this.dishRepository.save(new Dish({ name, shopId })) ? true : false
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  @Mutation('deleteDish')
  async deleteDish(@Args('id') id: string): Promise<boolean> {
    try {
      const deletedDish = await this.dishRepository.findOneAndUpdate({ _id: id }, { $set: { isActive: false } }, { returnOriginal: false })
      return await this.dishRepository.save(deletedDish.value) ? true : false
    } catch (error) {
      throw new ApolloError(error)
    }
  }
}
