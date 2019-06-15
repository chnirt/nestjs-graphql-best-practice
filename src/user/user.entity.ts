/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';

export class UserInput {
  username: string;
  password: string;
}

export abstract class IMutation {
  abstract createUser(input: UserInput): User | Promise<User>;

  abstract updateUser(_id: string, input: UserInput): User | Promise<User>;

  abstract deleteUser(_id: string): boolean | Promise<boolean>;
}

export abstract class IQuery {
  abstract users(): User[] | Promise<User[]>;

  abstract user(): User | Promise<User>;
}

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  username: string;
  @Column()
  password: string;
}
