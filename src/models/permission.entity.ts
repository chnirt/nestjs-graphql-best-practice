import {
	Entity,
	ObjectIdColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert
} from 'typeorm'
import { IsString } from 'class-validator'
import uuid = require('uuid')

export class CreatePermissionInput {
	code: string
	description: string
}
export class UpdatePermissionInput {
	code?: string
	description?: string
}

@Entity()
export class Permission {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	code: string

	@Column()
	@IsString()
	description: string

	@CreateDateColumn()
	createdAt: string
	@UpdateDateColumn()
	updatedAt: string

	@BeforeInsert()
	save() {
		this._id = uuid.v1()
	}
}
