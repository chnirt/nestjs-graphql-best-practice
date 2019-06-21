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
import { IsString, IsNotEmpty, Length, MinLength } from 'class-validator';

export class LoginUserInput {
  @IsString()
  @MinLength(4, {
    message: 'Your username must be at least 4 characters',
  })
  @IsNotEmpty()
  username: string;
  @Length(1, 8, {
    message: 'Your password must be between 1 and 8 characters.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserInput {
  @IsString()
  @MinLength(4, {
    message: 'Your username must be at least 4 characters',
  })
  @IsNotEmpty()
  username: string;
  @Length(1, 8, {
    message: 'Your password must be between 1 and 8 characters.',
    context: {
      errorCode: 1003,
      developerNote: 'The validated string must contain 32 or more characters.',
    },
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponse {
  @IsString()
  token: string;
}

@Entity()
export class User {
  @ObjectIdColumn()
  _id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  role: string;

  @Column()
  @IsString()
  @IsNotEmpty()
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
