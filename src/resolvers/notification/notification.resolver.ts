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

import { NOTIFICATION_SUBSCRIPTION } from '../../environments'

@Resolver('Notification')
export class NotificationResolver {
	constructor(
		@InjectRepository(Notification)
		private readonly notificationRepository: MongoRepository<Notification>
	) {}

	@Query()
	async notifications(): Promise<Notification[]> {
		return this.notificationRepository.find({
			cache: true
		})
	}

	@Mutation()
	async pushNotification(
		@Args('userIds') userIds: string[],
		@Args('label') label: string,
		@Context('pubsub') pubsub: any
	): Promise<Notification> {
		const newNotification = await this.notificationRepository.save(
			new Notification({ label })
		)

		pubsub.publish(NOTIFICATION_SUBSCRIPTION, { userIds, newNotification })

		return newNotification
	}

	@Subscription(() => Object, {
		filter: (payload: any, variables: any, context: any) => {
			const { userIds } = payload
			const { _id } = context.currentUser
			return userIds.indexOf(_id) > -1
		}
	})
	async newNotification(@Context('pubsub') pubsub: any): Promise<Notification> {
		return pubsub.asyncIterator(NOTIFICATION_SUBSCRIPTION)
	}
}
