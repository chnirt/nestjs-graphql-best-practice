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
import * as bcrypt from 'bcrypt'
import {
	IsString,
	IsNotEmpty,
	Length,
	MinLength,
	IsBoolean,
	IsArray,
	IsEmail,
	IsNumber
} from 'class-validator'
import { UserPermissionsInfo, PermissionInfoInput } from '../graphql'

export class SitesInfoInput {
	@Length(36, 36, {
		message: 'Your siteId must be 36 characters'
	})
	@IsString()
	@IsNotEmpty({ message: 'Your siteId can not be blank' })
	siteId: string

	@IsArray()
	@IsNotEmpty({ message: 'Your permissions can not be blank' })
	permissions: PermissionInfoInput[]
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

	@IsArray()
	@IsNotEmpty({ message: 'Your sites can not be blank' })
	sites: SitesInfoInput[]
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

	@IsArray()
	@IsNotEmpty({ message: 'Your sites can not be blank' })
	sites: SitesInfoInput[]
}

export class LoginResponse {
	@IsString()
	@IsNotEmpty()
	token: string

	@IsArray()
	@IsNotEmpty()
	userPermissions: UserPermissionsInfo[]
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
	password: string

	@Column()
	resetPasswordToken: string

	@Column()
	resetPasswordExpires: number

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

	@BeforeInsert()
	async save() {
		this._id = await uuid.v1()
		this.password = await bcrypt.hash(this.password, 10)
		this.isLocked = false
		this.isActive = true
		this.reason = ''
		this.createdAt = new Date().getTime()
		this.updatedAt = new Date().getTime()
	}

	@BeforeUpdate()
	async update() {
		this.updatedAt = new Date().getTime()
	}

	async hashPassword(password) {
		return await bcrypt.hash(password, 10)
	}

	async matchesPassword(password) {
		return await bcrypt.compare(password, this.password)
	}
}
