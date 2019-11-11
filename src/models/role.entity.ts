import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
	name: 'roles',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Role {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	nodeId: string

	@Expose()
	@Column()
	permissions: string[]

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number

	constructor(role: Partial<Role>) {
		if (role) {
			Object.assign(
				this,
				plainToClass(Role, role, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
