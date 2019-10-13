import {
	Resolver,
	Mutation,
	Args,
	Query,
	Context,
	Subscription
} from '@nestjs/graphql'
import { Notification } from '../../models'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { NotificationResponse } from '../../generator/graphql.schema'

import { NOTIFICATION_SUBSCRIPTION } from '../../environments'

@Resolver('Notification')
export class NotificationResolver {
	constructor(
		@InjectRepository(Notification)
		private readonly notificationRepository: MongoRepository<Notification>
	) {}

	@Query(() => [Notification])
	async notifications(): Promise<Notification[]> {
		return this.notificationRepository.find({
			cache: true
		})
	}

	@Mutation(() => Boolean)
	async pushNotification(
		@Args('userIds') userIds: string[],
		@Args('label') label: string,
		@Context('pubsub') pubsub: any
	): Promise<Notification> {
		const newNotification = await this.notificationRepository.save(
			new Notification({ label })
		)

		console.log(newNotification)
		const notificationResponse = new NotificationResponse()
		notificationResponse.userIds = userIds
		notificationResponse.newNotification = newNotification

		console.log(notificationResponse)

		pubsub.publish(NOTIFICATION_SUBSCRIPTION, { notificationResponse })

		return newNotification
	}

	@Subscription(() => Object, {
		filter: (payload: any, variables: any, context: any) => {
			const { userIds } = payload.notificationResponse
			const { _id } = context.currentUser
			return userIds.indexOf(_id) > -1
		}
	})
	async notificationResponse(
		@Context('pubsub') pubsub: any
	): Promise<NotificationResponse> {
		return pubsub.asyncIterator(NOTIFICATION_SUBSCRIPTION)
	}
}
