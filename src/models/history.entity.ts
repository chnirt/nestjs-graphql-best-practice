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
export class History {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	userId: string

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
