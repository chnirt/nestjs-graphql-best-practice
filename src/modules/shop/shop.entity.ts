import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm'
import { v1 as uuidv1 } from 'uuid'

@Entity()
export class Shop {
  @ObjectIdColumn()
  _id: string

	@Column()
	name: string

  @Column()
	isActive: boolean

	@CreateDateColumn()
	createAt: string

	@UpdateDateColumn()
	updateAt: string

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
