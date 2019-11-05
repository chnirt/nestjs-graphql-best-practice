import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
	name: 'notifications',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Notification {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	label: string

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number

	constructor(notification: Partial<Notification>) {
		if (notification) {
			Object.assign(
				this,
				plainToClass(Notification, notification, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
