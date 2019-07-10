/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
import {
	Entity,
	ObjectIdColumn,
	Column,
	// Index,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
	BeforeUpdate,
	BeforeRemove
} from 'typeorm'
import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'
import {
	IsString,
	IsNotEmpty,
	Length,
	MinLength,
	IsEmail,
	IsBoolean,
	IsArray
} from 'class-validator'
import { LoginResponseInfo } from '../../graphql'

export class LoginUserInput {
	@MinLength(4, {
		message: 'Your username must be at least 4 characters'
	})
	@IsString()
	@IsNotEmpty()
	username: string

	@Length(1, 8, {
		message: 'Your password must be between 1 and 8 characters.'
	})
	@IsString()
	@IsNotEmpty()
	password: string
}

export class CreateUserInput {
	@MinLength(4, {
		message: 'Your username must be at least 4 characters'
	})
	@IsString()
	@IsNotEmpty({ message: 'Your username can not be blank.' })
	username: string

	@Length(1, 8, {
		message: 'Your password must be between 1 and 8 characters.'
	})
	@IsString()
	@IsNotEmpty({ message: 'Your password can not be blank.' })
	password: string

	@Length(3, 20, {
		message: 'Your fullName must be between 3 and 20 characters.'
	})
	@IsString()
	@IsNotEmpty({ message: 'Your fullName can not be blank.' })
	fullName: string
}

export class UpdateUserInput {
	// @Length(1, 8, {
	// 	message: 'Your password must be between 1 and 8 characters.'
	// })
	// @IsString()
	// @IsNotEmpty({ message: 'Your password can not be blank.' })
	// password: string

	@Length(3, 20, {
		message: 'Your fullName must be between 3 and 20 characters.'
	})
	@IsString()
	// @IsNotEmpty({ message: 'Your fullName can not be blank.' })
	fullName?: string
}

export class LoginResponse {
	@IsString()
	@IsNotEmpty()
	token: string

	@IsArray()
	@IsNotEmpty()
	sites: LoginResponseInfo[]
}

@Entity()
export class User {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	@IsNotEmpty()
	username: string

	@Column()
	@IsString()
	@IsNotEmpty()
	password: string

	@Column()
	@IsString()
	@IsNotEmpty()
	fullName: string

	@Column()
	@IsBoolean()
	@IsNotEmpty()
	isLocked: boolean

	@Column()
	@IsString()
	reason: string

	@Column()
	@IsBoolean()
	@IsNotEmpty()
	isActive: boolean

	@CreateDateColumn()
	createdAt: string
	@UpdateDateColumn()
	updatedAt: string

	@BeforeInsert()
	async b4register() {
		this._id = await uuid.v1()
		this.password = await bcrypt.hash(this.password, 10)
		this.isLocked = false
		this.reason = ''
		this.isActive = true
	}

	// @BeforeUpdate()
	// async b4update() {
	// 	console.log('Hello')
	// }

	// @BeforeRemove()
	// async b4block() {
	// 	this.isActive = false
	// }

	async matchesPassword(password) {
		return await bcrypt.compare(password, this.password)
	}
}
