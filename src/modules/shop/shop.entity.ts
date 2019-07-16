import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm'
import { v1 as uuidv1 } from 'uuid'
import { DishInfo } from '../../graphql'

@Entity()
export class Shop {
  @ObjectIdColumn()
  _id: string

	@Column()
	name: string

	@Column()
	siteId: string

	@Column()
  dishes: [DishInfo] | []

  @Column()
	isActive: boolean

	@CreateDateColumn()
	createAt: string

	@UpdateDateColumn()
	updateAt: string

	@BeforeInsert()
	async b4create() {
		this._id = await uuidv1()
		this.dishes = []
		this.isActive = true
	}

	constructor(args) {
		if (args) {
			Object.assign(this, args)
		}
	}
}
