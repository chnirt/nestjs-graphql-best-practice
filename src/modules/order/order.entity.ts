import {
	Entity,
	ObjectIdColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import * as uuid from 'uuid'
import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator'

@Entity()
export class Order {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	@IsNotEmpty()
	userId: string

	@Column()
	@IsString()
	@IsNotEmpty()
	menuId: string

	@Column()
	@IsString()
	@IsNotEmpty()
	dishId: string

	@Column()
	@IsString()
	@IsNotEmpty()
	note: string

	@Column()
	@IsNumber()
	@IsNotEmpty()
	count: number

	@Column()
	@IsBoolean()
	@IsNotEmpty()
	isConfirmed: boolean

	@CreateDateColumn()
	createdAt: string

	@UpdateDateColumn()
	updatedAt: string

	@BeforeInsert()
	async b4create() {
		this._id = await uuid.v1()
		this.isConfirmed = false
	}

	// @BeforeUpdate()
	// async b4update() {
	// 	console.log('b4Order')
	// }
}
