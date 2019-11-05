import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
	name: 'forms',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Form {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	content: string

	@Expose()
	@Column()
	state: number

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number

	constructor(form: Partial<Form>) {
		if (form) {
			Object.assign(
				this,
				plainToClass(Form, form, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
			this.state = this.state || 0
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
