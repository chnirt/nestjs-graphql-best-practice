import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { uuidv4 } from '@utils'
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
			this._id = this._id || uuidv4()
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
