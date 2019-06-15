import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserInput } from './user.entity';
import { Repository, MongoRepository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(_id: string): Promise<User> {
    return await this.userRepository.findOne(_id);
  }

  async create(input: UserInput): Promise<User> {
    return await this.userRepository.save({ ...input });
  }

  // async update(_id: string, input: UserInput): Promise<User> {
  //   return await this.userRepository.update({ _id });
  // }

  async deleteAll(): Promise<boolean> {
    return (await this.userRepository.deleteMany({})) ? true : false;
  }
}
