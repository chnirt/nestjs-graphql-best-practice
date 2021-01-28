import {
	Resolver,
	Mutation,
	Args,
	Query,
	Context,
	Subscription
} from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { Message, Room, User } from '../entities'
import { CreateMessageInput } from '../generator/graphql.schema'

import { MESSAGES_SUBSCRIPTION } from '@environments'

@Resolver('Message')
export class MessageResolver {
	@Query()
	async messages(@Args('roomId') roomId: string): Promise<Message[]> {
		return getMongoRepository(Message).find({
			where: { roomId },
			cache: true
		})
	}

	@Mutation()
	async sendMessage(
		@Args('input') input: CreateMessageInput,
		@Context('currentUser') currentUser: User,
		@Context('pubsub') pubsub: any
	): Promise<Message> {
		const { roomId } = input

		const room = await getMongoRepository(Room).findOne({
			where: {
				_id: roomId,
				'users._id': currentUser._id
			}
		})

		if (!room) {
			throw new ForbiddenError('Room not found.')
		}

		const newMessage = await getMongoRepository(Message).save(
			new Message({ ...input, createdBy: [currentUser] })
		)

		room.messages = [...room.messages, newMessage]

		const newRoomWithMessages = await getMongoRepository(Room).save(room)

		const userIds = newRoomWithMessages.users.map(item => item._id)

		pubsub.publish(MESSAGES_SUBSCRIPTION, {
			userIds,
			newMessage: newRoomWithMessages
		})

		return newMessage
	}

	@Subscription(() => Object, {
		filter: (payload: any, variables: any, context: any) => {
			const { userIds } = payload
			const { _id } = context.currentUser
			return userIds.indexOf(_id) > -1
		}
	})
	async newMessages(@Context('pubsub') pubsub: any): Promise<Notification> {
		return pubsub.asyncIterator(MESSAGES_SUBSCRIPTION)
	}
}
