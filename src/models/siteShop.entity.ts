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
export class SiteShop {
	@ObjectIdColumn()
	_id: string

	@Column()
	siteId: string

	@Column()
	shopId: string

	@CreateDateColumn()
	createdAt: string

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
