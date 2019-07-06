import { Entity, ObjectIdColumn, Column, BeforeInsert, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { IsString, IsNotEmpty, IsArray } from 'class-validator'
import * as uuid from 'uuid'
import { Permission } from '../common/entities/entity.index'

@Entity()
export class UserPermission {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	@IsNotEmpty()
	userId: string

	@Column()
	@IsString()
	@IsNotEmpty()
	siteId: string

	@Column()
	@IsArray()
	@IsNotEmpty()
	permissions: string[]

	@CreateDateColumn()
	createdAt: string
	@UpdateDateColumn()
	updatedAt: string

	@BeforeInsert()
	async b4create() {
		this._id = await uuid.v1()
	}
}
