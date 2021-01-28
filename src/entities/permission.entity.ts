import { uuidv4 } from '@utils'

import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
	name: 'permissions',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Permission {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	code: string

	@Expose()
	@Column()
	description: string

	@Expose()
	@Column()
	isActive: boolean

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number

	constructor(permission: Partial<Permission>) {
		if (permission) {
			Object.assign(
				this,
				plainToClass(Permission, permission, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuidv4()
			this.isActive = this.isActive === undefined ? true : this.isActive
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
