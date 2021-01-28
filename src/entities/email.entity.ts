import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { uuidv4 } from '@utils'
import { Expose, plainToClass } from 'class-transformer'

enum Type {
	VERIFY_EMAIL,
	FORGOT_PASSWORD
}

@Entity({
	name: 'emails',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Email {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	userId: string

	@Expose()
	@Column()
	type: Type

	@Expose()
	@Column()
	isOpened: boolean

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number

	constructor(email: Partial<Email>) {
		if (email) {
			Object.assign(
				this,
				plainToClass(Email, email, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuidv4()
			this.isOpened = this.isOpened || false
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
