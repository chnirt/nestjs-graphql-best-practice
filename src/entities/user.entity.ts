import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { uuidv4 } from '@utils'
import { Exclude, Expose, plainToClass } from 'class-transformer'

import {
	Gender,
	Local,
	Google,
	Facebook,
	UserType
} from '../generator/graphql.schema'

@Entity({
	name: 'users',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class User {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	local: Local

	@Expose()
	@Column()
	google: Google

	@Expose()
	@Column()
	facebook: Facebook

	@Expose()
	@Column()
	firstName: string

	@Expose()
	@Column()
	lastName: string

	@Expose()
	@Column()
	avatar: string

	@Expose()
	@Column()
	resetPasswordToken: string

	@Expose()
	@Column()
	resetPasswordExpires: number

	// @Expose()
	// get fullName(): string {
	// 	return `${this.firstName} ${this.lastName}`;
	// }

	// @Transform(role => role.name)
	// role: RoleEntity;

	@Expose()
	@Column()
	gender: Gender

	@Expose()
	@Column()
	isVerified: boolean

	@Expose()
	@Column()
	isOnline: boolean

	@Expose()
	@Column()
	isLocked: boolean

	@Expose()
	@Column()
	reason: string

	@Expose()
	@Column()
	isActive: boolean

	@Expose()
	@Column()
	stripeId: string

	@Expose()
	@Column()
	ccLast4: string

	@Expose()
	@Column()
	type: UserType

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number

	constructor(user: Partial<User>) {
		if (user) {
			Object.assign(
				this,
				plainToClass(User, user, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuidv4()
			this.isVerified =
				this.isVerified !== undefined
					? this.isVerified
					: this.google || this.facebook
					? true
					: false
			this.isOnline = this.isOnline !== undefined ? this.isOnline : false
			this.isLocked = this.isLocked !== undefined ? this.isLocked : false
			this.reason = this.reason || ''
			this.isActive = this.isActive !== undefined ? this.isActive : true
			this.type = this.type || UserType.BASIC
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
