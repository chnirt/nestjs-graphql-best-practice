/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
import { Entity, ObjectIdColumn, Column, BeforeUpdate } from 'typeorm'
import {
	IsString,
	IsNotEmpty,
	IsBoolean,
	IsNumber,
	IsArray
} from 'class-validator'

@Entity()
export class OrderJ {
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

export class OrderJInput {
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

export class DishOrderJ {
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

export class MenuOrderJ {
	@IsString()
	@IsNotEmpty()
	menuId: string

	@IsArray()
	dishes: DishOrderJ[]

	@IsBoolean()
	isPublished: Boolean

	@IsBoolean()
	isLocked: Boolean
}

export class OrderJSubscriptionRespone {
	@IsString()
	@IsNotEmpty()
	menuId: string

	@IsString()
	@IsNotEmpty()
	dishId: string

	@IsNumber()
	impactUserId: string

	@IsNumber()
	orderQuantityNow: number

	@IsNumber()
	OrderQuantityOfImpactUser: number
}
