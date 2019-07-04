import { Entity, ObjectIdColumn, Column, BeforeInsert } from 'typeorm'
import { v1 as uuidv1} from 'uuid'

@Entity()
export class Permission {
  @ObjectIdColumn()
  _id: string

  @Column()
  code: string

  @Column()
  description: string

  @BeforeInsert()
  async b4Create() {
    this._id = await uuidv1()
  }
}
