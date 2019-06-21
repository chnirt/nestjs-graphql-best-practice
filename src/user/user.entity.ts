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
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  role: string;
  @Column()
  status: boolean;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;

  @BeforeInsert()
  async b4register() {
    this._id = await uuid.v4();
    this.role = await 'member';
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

  async matchesPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}
