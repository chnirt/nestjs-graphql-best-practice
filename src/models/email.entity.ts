import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import * as uuid from 'uuid'

enum Type {
	VERIFY_EMAIL,
	FORGOT_PASSWORD
}

@Entity({
	name: 'emails',
	orderBy: {
		createdAt: 'DESC'
	}
})
export class Email {
	@ObjectIdColumn()
	_id: string

	@Column()
	userId: string

	@Column()
	type: Type

	@Column()
	isOpened: boolean

	@Column()
	createdAt: number
	@Column()
	updatedAt: number

	constructor(email: Partial<Email>) {
		Object.assign(this, email)
	}

	@BeforeInsert()
	save() {
		this._id = uuid.v1()
		this.isOpened = false
		this.createdAt = +new Date()
		this.updatedAt = +new Date()
	}

	@BeforeUpdate()
	update() {
		this.updatedAt = +new Date()
	}
}
