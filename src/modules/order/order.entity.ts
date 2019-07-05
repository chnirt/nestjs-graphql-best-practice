import {
	Entity,
	ObjectIdColumn,
	Column,
	CreateDateColumn,
	BeforeInsert,
	UpdateDateColumn
} from 'typeorm'
import { v1 as uuidv1 } from 'uuid'

@Entity()
export class Order {
	@ObjectIdColumn()
	_id: string

	@Column()
	userId: string

	@Column()
	menuId: string

	@Column()
	dishId: string

	@Column()
	note: string

	@Column()
	count: number

	@Column()
	isConfirmed: boolean

	@CreateDateColumn({ type: 'timestamp' })
	createdDate: string

	@UpdateDateColumn()
	updatedAt: string

	@BeforeInsert()
	async b4create() {
		this._id = await uuidv1()
	}

	constructor(args) {
		if (args) {
			Object.assign(this, args)
		}
	}
}
