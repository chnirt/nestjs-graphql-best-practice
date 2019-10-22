import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import * as uuid from 'uuid'

enum NodeCategory {
	COMPANY,
	COUNTRY,
	CITY,
	SITE,
	DEPARTMENT
}

@Entity({
	name: 'nodes',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Node {
	@ObjectIdColumn()
	_id: string

	@Column()
	parentId: string

	@Column()
	category: NodeCategory

	@Column()
	name: string

	@Column()
	code: string

	@Column()
	path: string

	@Column()
	createdAt: number
	@Column()
	updatedAt: number

	constructor(node: Partial<Node>) {
		Object.assign(this, node)
	}

	@BeforeInsert()
	save() {
		this._id = uuid.v1()
		this.path = this.path ? `${this.path}/${this.code}` : this.code
		this.createdAt = +new Date()
		this.updatedAt = +new Date()
	}

	@BeforeUpdate()
	update() {
		this.updatedAt = +new Date()
	}
}
