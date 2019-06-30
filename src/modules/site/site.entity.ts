import {
	Entity,
	ObjectIdColumn,
	Column,
	Index,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert
} from 'typeorm'
import { IsString, IsNotEmpty } from 'class-validator'
import uuid = require('uuid')

@Entity()
export class Site {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	@IsNotEmpty()
	name: string

	@Column()
	@IsString()
	@IsNotEmpty()
	address: string

	@Column()
	@IsString()
	@IsNotEmpty()
	phone: string

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: string

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: string

	@BeforeInsert()
	async b4create() {
		this._id = await uuid.v1()
	}
}
