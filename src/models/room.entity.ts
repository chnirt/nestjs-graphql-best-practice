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
		createdAt: 'DESC'
	}
})
export class Room {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsNotEmpty()
	title: string

	@Column()
	@IsNotEmpty()
	users: User[]

	@Column()
	@IsNotEmpty()
	messages: Message[]

	@Column()
	createdAt: number
	@Column()
	updatedAt: number

	constructor(params: any) {
		Object.assign(this, params)
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
