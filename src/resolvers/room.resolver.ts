import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { Room, User } from '@entities'
import { CreateRoomInput } from '../generator/graphql.schema'

@Resolver('Room')
export class RoomResolver {
	@Query(() => [Room])
	async rooms(): Promise<Room[]> {
		return getMongoRepository(Room).find({
			cache: true
		})
	}

	@Query(() => Room)
	async room(@Args('_id') _id: string): Promise<Room> {
		const room = await getMongoRepository(Room).findOne({
			_id
		})

		if (!room) {
			throw new ForbiddenError('Room not found.')
		}

		return getMongoRepository(Room).findOne({
			_id
		})
	}

	@Mutation(() => Room)
	async createRoom(
		@Args('input') input: CreateRoomInput,
		@Context('currentUser') currentUser: User
	): Promise<Room> {
		const { title, userIds } = input

		if (userIds.length === 0) {
			throw new ForbiddenError('Room must have at least 2 people.')
		}

		const existedUserIds = await getMongoRepository(User).find({
			where: { _id: { $in: userIds, $ne: currentUser._id } }
		})

		if (userIds.length !== existedUserIds.length) {
			throw new ForbiddenError('One of userIds is invalid.')
		}

		return await getMongoRepository(Room).save(
			new Room({ title, users: [...existedUserIds, currentUser] })
		)
	}

	@Mutation(() => Boolean)
	async joinRoom(
		@Args('_id') _id: string,
		@Context('currentUser') currentUser: User
	): Promise<boolean> {
		const room = await getMongoRepository(Room).findOne({
			_id
		})

		if (!room) {
			throw new ForbiddenError('Room not found.')
		}

		const rs = room.users.filter(item => item._id === currentUser._id)

		if (rs.length > 0) {
			throw new ForbiddenError('You joined the room.')
		}

		room.users = [...room.users, currentUser]

		return getMongoRepository(Room).save(room) ? true : false
	}

	@Mutation(() => Boolean)
	async leaveRoom(
		@Args('_id') _id: string,
		@Context('currentUser') currentUser: User
	): Promise<boolean> {
		const room = await getMongoRepository(Room).findOne({
			_id
		})

		if (!room) {
			throw new ForbiddenError('Room not found.')
		}

		const rs = room.users.filter(item => item._id === currentUser._id)

		if (rs.length === 0) {
			throw new ForbiddenError('You are not in the room.')
		}

		room.users = room.users.filter(item => item._id !== currentUser._id)

		return getMongoRepository(Room).save(room) ? true : false
	}
}
