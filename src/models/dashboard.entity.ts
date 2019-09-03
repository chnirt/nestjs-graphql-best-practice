import {
	Entity,
	ObjectIdColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert
} from 'typeorm'
import { IsNotEmpty, IsJSON } from 'class-validator'
import * as uuid from 'uuid'
import * as GraphQLJSON from 'graphql-type-json'

@Entity()
export class Dashboard {
	@ObjectIdColumn()
	_id: string

	@Column()
	userId: string

	@Column()
	@IsJSON()
	@IsNotEmpty()
	data: GraphQLJSON

	@CreateDateColumn()
	createdAt: string
	@UpdateDateColumn()
	updatedAt: string

	@BeforeInsert()
	async b4create() {
		this._id = await uuid.v1()
	}
}
