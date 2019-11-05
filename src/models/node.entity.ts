import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

import { NodeCategory } from '../generator/graphql.schema'

@Entity({
	name: 'nodes',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Node {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	parentId: string

	@Expose()
	@Column()
	category: NodeCategory

	@Expose()
	@Column()
	name: string

	@Expose()
	@Column()
	code: string

	@Expose()
	@Column()
	path: string

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number

	constructor(node: Partial<Node>) {
		if (node) {
			Object.assign(
				this,
				plainToClass(Node, node, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
			this.path = this.path ? `${this.path}/${this.code}` : this.code
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
