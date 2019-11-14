import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import { Expose, plainToClass } from 'class-transformer'
import * as uuid from 'uuid'

import { User, Message } from '@models'

@Entity({
	name: 'rooms',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Room {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	title: string

	@Expose()
	@Column()
	users: User[]

	@Expose()
	@Column()
	messages: Message[]

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number

	constructor(room: Partial<Room>) {
		if (room) {
			Object.assign(
				this,
				plainToClass(Room, room, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
			this.messages = this.messages || []
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
