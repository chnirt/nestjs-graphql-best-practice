import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserInput, LoginResponse, LoginUserInput } from './user.entity';
import { MongoRepository } from 'typeorm';

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
    return await this.userRepository.findOne({ _id: _id });
  }

  async create(input: UserInput): Promise<User> {
    const user = new User();
    user.username = input.username;
    user.password = input.password;
    return await this.userRepository.save(user);
  }

  async update(_id: string, input: UserInput): Promise<boolean> {
    const user = new User();
    user._id = _id;
    user.username = input.username;
    user.password = input.password;
    return (await this.userRepository.save(user)) ? true : false;
  }

  async delete(_id: string): Promise<boolean> {
    const user = new User();
    user._id = _id;
    return (await this.userRepository.remove(user)) ? true : false;
  }

  async deleteAll(): Promise<boolean> {
    return (await this.userRepository.deleteMany({})) ? true : false;
  }

  async login(input: LoginUserInput): Promise<LoginResponse> {
    console.log('TCL: UserService -> input', input);

    return { token: '123123123' };
  }
}
