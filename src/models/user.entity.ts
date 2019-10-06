import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import * as uuid from 'uuid'
import { hash, compare } from 'bcrypt'
import {
	IsString,
	IsNotEmpty,
	Length,
	// MinLength,
	// IsBoolean,
	IsEmail
	// IsNumber
} from 'class-validator'
import { Exclude, Expose } from 'class-transformer'

import { SALT } from '../environments'

enum Gender {
	MALE,
	FEMALE
}

export class LoginUserInput {
	@IsEmail(undefined, { message: 'Your email can not be blank' })
	@IsNotEmpty({ message: 'Your email can not be blank' })
	email: string

	@Length(1, 8, {
		message: 'Your password must be between 1 and 8 characters'
	})
	@IsString()
	@IsNotEmpty()
	password: string
}

export class CreateUserInput {
	@Length(3, 20, {
		message: 'Your fullName must be between 3 and 20 characters'
	})
	@IsString()
	@IsNotEmpty({ message: 'Your firstName can not be blank' })
	firstName: string

	@Length(3, 20, {
		message: 'Your fullName must be between 3 and 20 characters'
	})
	@IsString()
	@IsNotEmpty({ message: 'Your lastName can not be blank' })
	lastName: string

	@IsEmail(undefined, { message: 'Your email can not be blank' })
	@IsNotEmpty({ message: 'Your email can not be blank' })
	email: string

	@Length(1, 8, {
		message: 'Your password must be between 1 and 8 characters'
	})
	@IsNotEmpty({ message: 'Your password can not be blank' })
	password: string

	@IsNotEmpty({ message: 'Your gender can not be blank' })
	gender: Gender
}

export class UpdateUserInput {
	@Length(3, 20, {
		message: 'Your fullName must be between 3 and 20 characters'
	})
	@IsString()
	firstName: string

	@Length(3, 20, {
		message: 'Your fullName must be between 3 and 20 characters'
	})
	@IsString()
	lastName: string

	@Length(1, 8, {
		message: 'Your password must be between 1 and 8 characters.'
	})
	@IsString()
	password: string

	@IsNotEmpty({ message: 'Your gender can not be blank' })
	gender: Gender
}

@Entity()
export class User {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsNotEmpty()
	firstName: string

	@Column()
	@IsNotEmpty()
	lastName: string

	@Column()
	@IsNotEmpty()
	email: string

	@Column()
	@IsNotEmpty()
	@Exclude()
	password: string

	@Column()
	resetPasswordToken: string

	@Column()
	resetPasswordExpires: number

	// @Expose()
	// get fullName(): string {
	// 	return `${this.firstName} ${this.lastName}`;
	// }

	// @Transform(role => role.name)
	// role: RoleEntity;

	@Column()
	@IsNotEmpty()
	gender: Gender

	@Column()
	@IsNotEmpty()
	isVerified: boolean

	@Column()
	@IsNotEmpty()
	isLocked: boolean

	@Column()
	reason: string

	@Column()
	@IsNotEmpty()
	isActive: boolean

	@Column()
	createdAt: number
	@Column()
	updatedAt: number

	// constructor(partial: Partial<User>) {
	// 	Object.assign(this, partial)
	// }

	@BeforeInsert()
	save() {
		this._id = uuid.v1()
		this.isVerified = false
		this.isLocked = false
		this.reason = ''
		this.isActive = true
		this.createdAt = +new Date()
		this.updatedAt = +new Date()
	}

	@BeforeUpdate()
	update() {
		this.updatedAt = +new Date()
	}

	hashPassword(password) {
		return hash(password, SALT)
	}

	matchesPassword(password) {
		return compare(password, this.password)
	}
}
