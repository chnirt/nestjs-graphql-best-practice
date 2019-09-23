import {
	Entity,
	ObjectIdColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert
} from 'typeorm'
import { v1 as uuidv1 } from 'uuid'

@Entity()
export class Dish {
	@ObjectIdColumn()
	_id: string

	@Column()
	name: string

	@Column()
	isActive: boolean

	@Column()
	shopId: string

	@CreateDateColumn()
	createdAt: string

	@UpdateDateColumn()
	updatedAt: string

	@BeforeInsert()
	async b4create() {
		this._id = await uuidv1()
		this.isActive = true
	}

	constructor(args) {
		if (args) {
			Object.assign(this, args)
		}
	}
}
