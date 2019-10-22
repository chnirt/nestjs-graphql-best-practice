import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import * as uuid from 'uuid'
import { PermissionInfo } from '../generator/graphql.schema'

@Entity({
	name: 'roles',
	orderBy: {
		createdAt: 'DESC'
	}
})
export class Role {
	@ObjectIdColumn()
	_id: string

	@Column()
	userId: string

	@Column()
	path: string

	@Column()
	name: string

	@Column()
	permissions: PermissionInfo[]

	@Column()
	createdAt: number
	@Column()
	updatedAt: number

	constructor(role: Partial<Role>) {
		Object.assign(this, role)
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
