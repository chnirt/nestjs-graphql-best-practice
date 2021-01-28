import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { uuidv4 } from '@utils'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
	name: 'user_role',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class UserRole {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	userId: string

	@Expose()
	@Column()
	roleId: string

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number

	constructor(userRole: Partial<UserRole>) {
		if (userRole) {
			Object.assign(
				this,
				plainToClass(UserRole, userRole, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuidv4()
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
