import * as uuid from 'uuid'

import {
	NodeCategory,
	Company,
	City,
	Store,
	Department,
	Position
} from '../generator/graphql.schema'
import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { Expose, plainToClass } from 'class-transformer'

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
	name: string

	@Expose()
	@Column()
	category: NodeCategory

	@Expose()
	@Column()
	company: Company

	@Expose()
	@Column()
	city: City

	@Expose()
	@Column()
	store: Store

	@Expose()
	@Column()
	department: Department

	@Expose()
	@Column()
	position: Position

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
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
