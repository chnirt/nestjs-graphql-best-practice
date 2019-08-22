import {
	Entity,
	ObjectIdColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert
} from 'typeorm'
import { IsNotEmpty, IsString } from 'class-validator'
import * as uuid from 'uuid'

@Entity()
export class File {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsNotEmpty()
	@IsString()
	encoding: string

	@Column()
	@IsNotEmpty()
	@IsString()
	filename: string

	@Column()
	@IsNotEmpty()
	@IsString()
	mimetype: string

	@CreateDateColumn()
	createdAt: string
	@UpdateDateColumn()
	updatedAt: string

	@BeforeInsert()
	async b4create() {
		this._id = await uuid.v1()
	}
}
