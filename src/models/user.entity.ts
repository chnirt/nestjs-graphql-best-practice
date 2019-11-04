import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import * as uuid from 'uuid'
import {
	Gender,
	Local,
	Google,
	Facebook,
	UserType
} from '../generator/graphql.schema'
// import { Exclude, Expose } from 'class-transformer'

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
	stripeId: string

	@Column()
	ccLast4: string

	@Column()
	type: UserType

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
		this.type = UserType.BASIC
		this.createdAt = +new Date()
		this.updatedAt = +new Date()
	}

	@BeforeUpdate()
	update() {
		this.updatedAt = +new Date()
	}
}
