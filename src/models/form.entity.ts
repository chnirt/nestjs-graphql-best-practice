import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import * as uuid from 'uuid'

@Entity({
	name: 'forms',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Form {
	@ObjectIdColumn()
	_id: string

	@Column()
	content: string

	@Column()
	state: number

	@Column()
	createdAt: number
	@Column()
	updatedAt: number

	constructor(form: Partial<Form>) {
		Object.assign(this, form)
	}

	@BeforeInsert()
	save() {
		this._id = uuid.v1()
		this.state = 0
		this.createdAt = +new Date()
		this.updatedAt = +new Date()
	}

	@BeforeUpdate()
	update() {
		this.updatedAt = +new Date()
	}
}
