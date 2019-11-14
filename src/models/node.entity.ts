import * as uuid from 'uuid'

import { Column, Entity, ObjectIdColumn } from 'typeorm'
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
	isActive: boolean

	@Expose()
	@Column()
	createdAt: number

	@Expose()
	@Column()
	createdBy: string

	@Expose()
	@Column()
	updatedAt: number

	@Expose()
	@Column()
	updatedBy: string

	constructor(node: Partial<Node>) {
		if (node) {
			Object.assign(
				this,
				plainToClass(Node, node, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
			this.isActive = this.isActive === undefined ? true : this.isActive
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
