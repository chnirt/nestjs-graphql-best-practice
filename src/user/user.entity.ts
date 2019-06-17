/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
import {
  Entity,
  Column,
  ObjectIdColumn,
  BeforeInsert,
  BeforeUpdate,
  BeforeRemove,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

export class LoginUserInput {
  username: string;
  password: string;
}

export class UserInput {
  username: string;
  password: string;
}

export class LoginResponse {
  token: string;
}

@Entity()
export class User {
  @ObjectIdColumn()
  _id: string;
  @Column('varchar', { length: 255 })
  username: string;
  @Column('varchar', { length: 255 })
  password: string;
  @Column('bit')
  status: boolean;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;

  @BeforeInsert()
  async b4register() {
    this._id = await uuid.v4();
    this.status = await true;
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeUpdate()
  async b4update() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeRemove()
  async b4block() {
    this.status = false;
  }
}
