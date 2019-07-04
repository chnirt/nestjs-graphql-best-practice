import { Entity, ObjectIdColumn, Column, CreateDateColumn, BeforeInsert } from 'typeorm'
import { v1 as uuidv1} from 'uuid'

@Entity()
export class Site {
  @ObjectIdColumn()
  _id: string

  @Column()
  name: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string

  @Column()
  updatedAt: string

  @BeforeInsert()
  async b4create() {
    this._id = await uuidv1()
  }
}
