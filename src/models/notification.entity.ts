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
		createdAt: 'DESC'
	}
})
export class Notification {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsNotEmpty()
	label: string

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
