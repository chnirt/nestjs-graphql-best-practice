import {
	Resolver,
	Query,
	Mutation,
	Args,
	Subscription,
	Context
} from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { UserService } from './user.service'
import { User, UserInput, LoginResponse, LoginUserInput } from './user.entity'

const pubSub = new PubSub()

@Resolver('User')
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => String)
	async hello() {
		return await 'world'
	}

	@Query(() => User)
	async me(@Context('currentUser') currentUser: User) {
		return await currentUser
	}

	@Query(() => [User])
	async users(@Args('offset') offset: number, @Args('limit') limit: number) {
		return this.userService.findAll(offset, limit)
	}

	@Query(() => User)
	async user(@Args('_id') _id: string) {
		return this.userService.findById(_id)
	}

	@Mutation(() => User, { name: 'register' })
	async createUser(@Args('input') input: UserInput) {
		const createdUser = await this.userService.create(input)
		pubSub.publish('userCreated', { userCreated: createdUser })
		return createdUser
	}

	@Mutation(() => Boolean)
	async updateUser(@Args('_id') _id: string, @Args('input') input: UserInput) {
		return await this.userService.update(_id, input)
	}

	@Mutation(() => Boolean)
	async deleteUser(@Args('_id') _id: string) {
		return await this.userService.delete(_id)
	}

	@Mutation(() => Boolean)
	async deleteAll() {
		return await this.userService.deleteAll()
	}

	@Mutation(() => LoginResponse)
	async login(@Args('input') input: LoginUserInput) {
		return await this.userService.login(input)
	}

	@Mutation(() => Boolean)
	async setRole(@Args('_id') _id: string, @Args('role') role: string) {
		return await this.userService.setRole(_id, role)
	}

	@Subscription()
	userCreated() {
		return pubSub.asyncIterator('userCreated')
	}
}
