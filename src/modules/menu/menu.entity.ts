import {
	Entity,
	ObjectIdColumn,
	Column,
	CreateDateColumn,
	BeforeInsert,
	UpdateDateColumn
} from 'typeorm'
import { v1 as uuidv1 } from 'uuid'
import { DishInfo } from '../common/entities/interface.entity'

@Entity()
export class Menu {
	@ObjectIdColumn()
	_id: string

	@Column()
	name: string

	@Column()
	siteId: string

	@Column()
	dishes: [DishInfo] | []

	@Column()
	isPublish: boolean

	@Column()
	isLocked: boolean

	@CreateDateColumn({ type: 'timestamp' })
	createAt: string

	@UpdateDateColumn({ type: 'timestamp' })
	updateAt: string

	@BeforeInsert()
	async b4create() {
		this._id = await uuidv1()
		this.dishes = []
		this.isPublish = false
		this.isLocked = true
	}

	constructor(args) {
		if (args) {
			Object.assign(this, args)
		}
	}
}
