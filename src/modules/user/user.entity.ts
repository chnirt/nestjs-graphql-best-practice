/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
import {
	Entity,
	ObjectIdColumn,
	Column,
	Index,
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
	IsBoolean
} from 'class-validator'

export class LoginUserInput {
	@IsString()
	@MinLength(4, {
		message: 'Your username must be at least 4 characters'
	})
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
	@IsString()
	@MinLength(4, {
		message: 'Your username must be at least 4 characters'
	})
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
	@IsString()
	@MinLength(4, {
		message: 'Your username must be at least 4 characters'
	})
	// @IsNotEmpty({ message: 'Your username can not be blank.' })
	username: string

	@Length(1, 8, {
		message: 'Your password must be between 1 and 8 characters.'
	})
	@IsString()
	// @IsNotEmpty({ message: 'Your password can not be blank.' })
	password: string

	@Length(3, 20, {
		message: 'Your fullName must be between 3 and 20 characters.'
	})
	@IsString()
	// @IsNotEmpty({ message: 'Your fullName can not be blank.' })
	fullName: string
}

export class LoginResponse {
	@IsString()
	token: string
}

@Entity()
export class User {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	@IsNotEmpty()
	@Index({ unique: true })
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
	@IsNotEmpty()
	reason: string

	@Column()
	@IsBoolean()
	@IsNotEmpty()
	isActive: boolean

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: string
	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: string

	@BeforeInsert()
	async b4register() {
		this._id = await uuid.v1()
		this.password = await bcrypt.hash(this.password, 10)
		this.isLocked = await false
		this.reason = await ''
		this.isActive = await true
	}

	@BeforeUpdate()
	async b4update() {
		this.password = await bcrypt.hash(this.password, 10)
	}

	// @BeforeRemove()
	// async b4block() {
	// 	this.isActive = false
	// }

	async matchesPassword(password) {
		return await bcrypt.compare(password, this.password)
	}
}
