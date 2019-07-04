import { Entity, ObjectIdColumn, Column, BeforeInsert } from 'typeorm'
import { v1 as uuidv1} from 'uuid'
import { PermissionInfo } from './interface.entity';

@Entity()
export class UserPermission {
  @ObjectIdColumn()
  _id: string

  @Column()
  userId: string

  @Column()
  siteId: string

  @Column()
  permissions: [PermissionInfo]

  @BeforeInsert()
  async b4Create() {
    this._id = await uuidv1()
  }
}
