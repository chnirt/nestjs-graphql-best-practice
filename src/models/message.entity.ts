import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import * as uuid from 'uuid'
import { User } from '../generator/graphql.schema'

@Entity({
	name: 'messages',
	orderBy: {
		createdAt: 'DESC'
	}
})
export class Message {
	@ObjectIdColumn()
	_id: string

	@Column()
	text: string

	@Column()
	roomId: string

	@Column()
	createdBy: User[]

	@Column()
	createdAt: number
	@Column()
	updatedAt: number

	constructor(message: Partial<Message>) {
		Object.assign(this, message)
	}

	@BeforeInsert()
	save() {
		this._id = uuid.v1()
		this.createdAt = +new Date()
		this.updatedAt = +new Date()
	}

	@BeforeUpdate()
	update() {
		this.updatedAt = +new Date()
	}
}
