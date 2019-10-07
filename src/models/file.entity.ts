import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import { IsString } from 'class-validator'
import * as uuid from 'uuid'

@Entity()
export class File {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	filename: string

	@Column()
	@IsString()
	path: string

	@Column()
	createdAt: number
	@Column()
	updatedAt: number

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
