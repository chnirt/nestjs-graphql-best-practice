import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import * as uuid from 'uuid'
import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator'
import { Gender, Local, Google, Facebook } from '../generator/graphql.schema'
// import { Exclude, Expose } from 'class-transformer'

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
		message: 'Your firstName must be between 3 and 20 characters'
	})
	@IsString()
	@IsNotEmpty({ message: 'Your firstName can not be blank' })
	firstName: string

	@Length(3, 20, {
		message: 'Your lastName must be between 3 and 20 characters'
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
		message: 'Your firstName must be between 3 and 20 characters'
	})
	@IsString()
	firstName: string

	@Length(3, 20, {
		message: 'Your lastName must be between 3 and 20 characters'
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

@Entity({
	name: 'users',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class User {
	@ObjectIdColumn()
	_id: string

	@Column()
	local: Local

	@Column()
	google: Google

	@Column()
	facebook: Facebook

	@Column()
	firstName: string

	@Column()
	lastName: string

	@Column()
	avatar: string

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
	gender: Gender

	@Column()
	isVerified: boolean

	@Column()
	isOnline: boolean

	@Column()
	isLocked: boolean

	@Column()
	reason: string

	@Column()
	isActive: boolean

	@Column()
	createdAt: number
	@Column()
	updatedAt: number

	constructor(user?: Partial<User>) {
		if (user) {
			Object.assign(this, user)
			this._id = uuid.v1()
			this.isVerified = this.google || this.facebook ? true : false
			this.isOnline = false
			this.isLocked = false
			this.reason = ''
			this.isActive = true
			this.createdAt = this.createdAt ? this.createdAt : +new Date()
			this.updatedAt = +new Date()
		}
	}

	@BeforeInsert()
	save() {
		this._id = uuid.v1()
		this.isVerified = this.google ? true : false
		this.isOnline = false
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
}
