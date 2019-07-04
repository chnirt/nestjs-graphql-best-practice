import { Entity, ObjectIdColumn, Column, CreateDateColumn, BeforeInsert } from 'typeorm'
import { v1 as uuidv1 } from 'uuid'
import { DishInfo } from './interface.entity';

@Entity()
export class Menu {

  @ObjectIdColumn()
  _id: string

  @Column()
  name: string

  @Column()
  siteId: string

  @Column()
  dishes: [DishInfo]

  @Column()
  isPublish: boolean

  @Column()
  isLocked: boolean

  @CreateDateColumn({ type: 'timestamp' })
  createAt: string

  @Column()
  updateAt: string

  @BeforeInsert()
  async b4create() {
    this._id = await uuidv1()
  }

}
