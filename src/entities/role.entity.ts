import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { uuidv4 } from '@utils'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
	name: 'roles',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Role {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	code: string

	@Expose()
	@Column()
	description: string

	@Expose()
	@Column()
	nodeId: string

	@Expose()
	@Column()
	permissions: string[]

	@Expose()
	@Column()
	isActive: boolean

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number

	constructor(role: Partial<Role>) {
		if (role) {
			Object.assign(
				this,
				plainToClass(Role, role, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuidv4()
			this.isActive = this.isActive === undefined ? true : this.isActive
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
