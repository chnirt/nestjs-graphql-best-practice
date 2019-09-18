import {
	Entity,
	ObjectIdColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert
} from 'typeorm'
import * as uuid from 'uuid'
import { IsString, IsBoolean, IsNumber } from 'class-validator'

@Entity()
export class Order {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	userId: string

	@Column()
	@IsString()
	menuId: string

	@Column()
	@IsString()
	dishId: string

	@Column()
	@IsString()
	note: string

	@Column()
	@IsNumber()
	count: number

	@Column()
	@IsBoolean()
	isConfirmed: boolean

	@CreateDateColumn()
	createdAt: string
	@UpdateDateColumn()
	updatedAt: string

	@BeforeInsert()
	save() {
		this._id = uuid.v1()
		this.isConfirmed = false
		this.note = ''
	}
}
