import {
	Resolver,
	Mutation,
	Args,
	Query,
	Context,
	Subscription
} from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'

import { Notification } from '@entities'

import { NOTIFICATION_SUBSCRIPTION } from '@environments'

@Resolver('Notification')
export class NotificationResolver {
	@Query()
	async notifications(): Promise<Notification[]> {
		return getMongoRepository(Notification).find({
			cache: true
		})
	}

	@Mutation()
	async pushNotification(
		@Args('userIds') userIds: string[],
		@Args('label') label: string,
		@Context('pubsub') pubsub: any
	): Promise<Notification> {
		const newNotification = await getMongoRepository(Notification).save(
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
