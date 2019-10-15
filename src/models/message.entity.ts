import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import * as uuid from 'uuid'
import { User } from './user.entity'

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
	@IsNotEmpty()
	text: string

	@Column()
	@IsNotEmpty()
	roomId: string

	@Column()
	@IsNotEmpty()
	createdBy: User[]

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
		this.createdAt = +new Date()
		this.updatedAt = +new Date()
	}

	@BeforeUpdate()
	update() {
		this.updatedAt = +new Date()
	}
}
