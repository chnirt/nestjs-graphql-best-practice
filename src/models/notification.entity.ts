import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import * as uuid from 'uuid'

@Entity({
	name: 'notifications',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Notification {
	@ObjectIdColumn()
	_id: string

	@Column()
	label: string

	@Column()
	createdAt: number
	@Column()
	updatedAt: number

	constructor(notification: Partial<Notification>) {
		Object.assign(this, notification)
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
