import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

import {
	NodeCategory,
	Company,
	City,
	Store,
	Department,
	Position,
	Job
} from '../generator/graphql.schema'

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
	job: Job

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
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
