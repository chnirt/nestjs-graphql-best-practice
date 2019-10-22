import { Entity, ObjectIdColumn, Column } from 'typeorm'

@Entity({
	name: 'permissions',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Permission {
	@ObjectIdColumn()
	_id: string

	@Column()
	code: string

	@Column()
	description: string

	@Column()
	createdAt: number
	@Column()
	updatedAt: number
}
