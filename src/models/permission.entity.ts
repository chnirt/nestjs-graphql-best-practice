import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
	name: 'permissions',
	orderBy: {
		createdAt: 'ASC',
	},
})
export class Permission {
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
	isActive: boolean

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number
}
