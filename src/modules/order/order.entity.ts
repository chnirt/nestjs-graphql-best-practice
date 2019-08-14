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
import {
	IsString,
	IsNotEmpty,
	IsBoolean,
	IsNumber,
	IsArray
} from 'class-validator'

@Entity()
export class Order {
	@ObjectIdColumn()
	@IsString()
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
	note: string

	@Column()
	@IsNumber()
	@IsNotEmpty()
	count: number

	@Column()
	@IsBoolean()
	@IsNotEmpty()
	isConfirmed: boolean

	@Column()
	@IsString()
	@IsNotEmpty()
	createdAt: string

	@Column()
	@IsString()
	@IsNotEmpty()
	updatedAt: string

	@BeforeUpdate()
	async b4update() {
		this.updatedAt = new Date().toISOString()
	}
}

export class OrderInput {
	@IsString()
	@IsNotEmpty()
	menuId: string

	@IsString()
	@IsNotEmpty()
	dishId: string

	@IsNumber()
	@IsNotEmpty()
	count: number
}

export class DishOrder {
	@IsString()
	@IsNotEmpty()
	dishId: string

	@IsString()
	@IsNotEmpty()
	name: string

	@IsNumber()
	@IsNotEmpty()
	MyOrderQuantity: number

	@IsNumber()
	@IsNotEmpty()
	orderQuantityNow: number

	@IsNumber()
	@IsNotEmpty()
	orderQuantityMax: number
}

export class MenuOrder {
	@IsString()
	@IsNotEmpty()
	menuId: string

	@IsArray()
	dishes: DishOrder[]
}

// @Entity()
// export class Order {
// 	@ObjectIdColumn()
// 	_id: string

// 	@Column()
// 	@IsString()
// 	@IsNotEmpty()
// 	userId: string

// 	@Column()
// 	@IsString()
// 	@IsNotEmpty()
// 	menuId: string

// 	@Column()
// 	@IsString()
// 	@IsNotEmpty()
// 	dishId: string

// 	@Column()
// 	@IsString()
// 	@IsNotEmpty()
// 	note: string

// 	@Column()
// 	@IsNumber()
// 	@IsNotEmpty()
// 	count: number

// 	@Column()
// 	@IsBoolean()
// 	@IsNotEmpty()
// 	isConfirmed: boolean

// 	@CreateDateColumn()
// 	createdAt: string

// 	@UpdateDateColumn()
// 	updatedAt: string

// 	@BeforeInsert()
// 	async b4create() {
// 		this._id = await uuid.v1()
// 		this.isConfirmed = false
// 	}

// 	// @BeforeUpdate()
// 	// async b4update() {
// 	// 	console.log('b4Order')
// 	// }
// }
