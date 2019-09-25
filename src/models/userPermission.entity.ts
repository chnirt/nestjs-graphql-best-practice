import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm'
import * as uuid from 'uuid'
import { PermissionInfo } from '../graphql.schema'

@Entity()
export class UserPermission {
	@ObjectIdColumn()
	_id: string

	@Column()
	userId: string

	@Column()
	siteId: string

	@Column()
	siteName: string

	@Column()
	permissions: PermissionInfo[]

	@CreateDateColumn()
	createdAt: string
	@UpdateDateColumn()
	updatedAt: string

	@BeforeInsert()
	save() {
		this._id = uuid.v1()
	}
}
