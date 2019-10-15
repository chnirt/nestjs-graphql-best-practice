import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql'
import { Room } from '../../models'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository, getMongoRepository } from 'typeorm'
import { CreateRoomInput } from '../../generator/graphql.schema'
import { User } from '../../models'
import { ForbiddenError } from 'apollo-server-core'

@Resolver('Room')
export class RoomResolver {
	constructor(
		@InjectRepository(Room)
		private readonly roomRepository: MongoRepository<Room>
	) {}

	@Query(() => [Room])
	async rooms(): Promise<Room[]> {
		return this.roomRepository.find({
			cache: true
		})
	}

	@Query(() => Room)
	async room(@Args('_id') _id: string): Promise<Room> {
		return this.roomRepository.findOne({
			_id
		})
	}

	@Mutation(() => Room)
	async createRoom(
		@Args('input') input: CreateRoomInput,
		@Context('currentUser') currentUser: User
	): Promise<Room> {
		const { userIds } = input

		if (userIds.length === 0) {
			throw new ForbiddenError('Room must have at least 2 people.')
		}

		const existedUserIds = await getMongoRepository(User).find({
			where: { _id: { $in: userIds } },
			select: ['_id', 'email']
		})

		if (userIds.length !== existedUserIds.length) {
			throw new ForbiddenError('One of userIds is invalid.')
		}

		// const { _id } = currentUser

		console.log('existedUserIds', [...existedUserIds])

		// return await this.roomRepository.save(new Room(input))
		return null
	}

	// @Mutation(() => Boolean)
	// async openRoom(@Args('_id') _id: string): Promise<boolean> {
	// 	const Room = await this.roomRepository.findOne({
	// 		_id
	// 	})

	// 	if (!Room) {
	// 		throw new ApolloError('Not Found: Room', '404', {})
	// 	}

	// 	Room.isOpened = true

	// 	return this.RoomRepository.save(Room) ? true : false
	// }
}
