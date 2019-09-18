import {
	Entity,
	ObjectIdColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert
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

	@CreateDateColumn()
	createdAt: string
	@UpdateDateColumn()
	updatedAt: string

	@BeforeInsert()
	save() {
		this._id = uuid.v1()
	}
}
