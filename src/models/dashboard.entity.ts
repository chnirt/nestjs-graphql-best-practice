import {
	Entity,
	ObjectIdColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert
} from 'typeorm'
import { IsString, IsJSON } from 'class-validator'
import * as uuid from 'uuid'
import * as GraphQLJSON from 'graphql-type-json'

@Entity()
export class Dashboard {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	userId: string

	@Column()
	@IsJSON()
	data: GraphQLJSON

	@CreateDateColumn()
	createdAt: string
	@UpdateDateColumn()
	updatedAt: string

	@BeforeInsert()
	save() {
		this._id = uuid.v1()
	}
}
