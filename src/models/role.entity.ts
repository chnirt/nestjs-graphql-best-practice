import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

import { PermissionInfo } from '../generator/graphql.schema'

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
	name: string

	@Expose()
	@Column()
	nodeId: string

	@Expose()
	@Column()
	permissions: PermissionInfo[]

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
