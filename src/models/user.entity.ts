import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import {
	Gender,
	Local,
	Google,
	Facebook,
	UserType
} from '../generator/graphql.schema'
import { Exclude, Expose, plainToClass } from 'class-transformer'

@Entity({
	name: 'users',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class User {
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	local: Local

	@Column()
	google: Google

	@Column()
	facebook: Facebook

	@Expose()
	@Column()
	firstName: string

	@Expose()
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

	@Expose()
	@Column()
	gender: Gender

	@Column()
	isVerified: boolean

	@Column()
	isOnline: boolean

	@Column()
	isLocked: boolean

	@Expose()
	@Column()
	reason: string

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

	@Column()
	createdAt: number
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
			this._id = uuid.v1()
			this.isVerified = this.google || this.facebook ? true : false
			this.isOnline = false
			this.isLocked = false
			this.reason = ''
			this.isActive = true
			this.type = UserType.BASIC
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
