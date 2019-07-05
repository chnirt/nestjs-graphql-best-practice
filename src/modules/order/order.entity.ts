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
export class Order {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
  @IsNotEmpty()
  menuId: string
  dishId: String
  note: string
  count: number
  isComfirmed: boolean

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
		console.log('b4Order')
		// this.password = await bcrypt.hash(this.password, 10)
	}
}
