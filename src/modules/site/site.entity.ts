import {
	Entity,
	ObjectIdColumn,
	Column,
	Index,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import * as uuid from 'uuid'
import { IsString, IsNotEmpty } from 'class-validator'

@Entity()
export class Site {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	@IsNotEmpty()
	name: string

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: string

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: string

	@BeforeInsert()
	async b4create() {
		this._id = await uuid.v1()
	}

	@BeforeUpdate()
	async b4update() {
		console.log('b4Site')
		// this.password = await bcrypt.hash(this.password, 10)
	}
}
