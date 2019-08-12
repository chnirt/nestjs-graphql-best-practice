import {
	Entity,
	ObjectIdColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert
} from 'typeorm'
import * as uuid from 'uuid'
import { IsString, IsNotEmpty } from 'class-validator'

@Entity()
export class Site {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	@IsNotEmpty()
	name: string

	@CreateDateColumn()
	createdAt: string

	@UpdateDateColumn()
	updatedAt: string

	@BeforeInsert()
	async b4create() {
		this._id = await uuid.v1()
	}
}
