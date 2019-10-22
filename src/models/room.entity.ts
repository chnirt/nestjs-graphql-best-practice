import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { User } from './user.entity'
import { Message } from './message.entity'
import * as uuid from 'uuid'

@Entity({
	name: 'rooms',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Room {
	@ObjectIdColumn()
	_id: string

	@Column()
	title: string

	@Column()
	users: User[]

	@Column()
	messages: Message[]

	@Column()
	createdAt: number
	@Column()
	updatedAt: number

	constructor(room: Partial<Room>) {
		Object.assign(this, room)
	}

	@BeforeInsert()
	save() {
		this._id = uuid.v1()
		this.messages = []
		this.createdAt = +new Date()
		this.updatedAt = +new Date()
	}

	@BeforeUpdate()
	update() {
		this.updatedAt = +new Date()
	}
}
