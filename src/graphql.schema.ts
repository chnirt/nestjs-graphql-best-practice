/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum RecordType {
  User = 'User',
  File = 'File',
}

export class CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: Gender;
}

export class FileInput {
  filename?: string;
}

export class LoginUserInput {
  email: string;
  password: string;
}

export class RecordInput {
  User?: UserInput;
  File?: FileInput;
}

export class SearchInput {
  select?: string[];
  where?: RecordInput;
  start?: number;
  end?: number;
  order?: JSONObject;
  skip?: number;
  take?: number;
}

export class UpdateUserInput {
  firstName: string;
  lastName: string;
  password: string;
  gender: Gender;
}

export class UserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  gender?: Gender;
}

export class File {
  _id: string;
  filename: string;
  path: string;
  createdAt: number;
  updatedAt: number;
}

export class LoginResponse {
  token: string;
}

export abstract class IMutation {
  abstract uploadFile(file: Upload): boolean | Promise<boolean>;

  abstract createUser(input: CreateUserInput): User | Promise<User>;

  abstract updateUser(
    _id: string,
    input: UpdateUserInput,
  ): boolean | Promise<boolean>;

  abstract deleteUser(_id: string): boolean | Promise<boolean>;

  abstract deleteUsers(): boolean | Promise<boolean>;

  abstract login(input: LoginUserInput): LoginResponse | Promise<LoginResponse>;

  abstract lockAndUnlockUser(
    _id: string,
    reason: string,
  ): boolean | Promise<boolean>;

  abstract changePassword(
    _id: string,
    currentpassword: string,
    password: string,
  ): boolean | Promise<boolean>;

  abstract forgotPassword(email: string): boolean | Promise<boolean>;

  abstract resetPassword(
    resetPasswordToken: string,
    password: string,
  ): boolean | Promise<boolean>;
}

export abstract class IQuery {
  abstract files(): File[] | Promise<File[]>;

  abstract hello(): string | Promise<string>;

  abstract me(): User | Promise<User>;

  abstract users(offset?: number, limit?: number): User[] | Promise<User[]>;

  abstract user(_id: string): User | Promise<User>;

  abstract search(
    conditions: SearchInput,
    type: RecordType,
  ): Result[] | Promise<Result[]>;

  abstract searchUser(userIds?: string[]): UserResult | Promise<UserResult>;
}

export abstract class ISubscription {
  abstract userCreated(): User | Promise<User>;
}

export class User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: Gender;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  fullName?: string;
  isLocked: boolean;
  reason: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export class Users {
  users?: User[];
}

export type JSON = any;
export type JSONObject = any;
export type Upload = any;
export type Result = User | File;
export type UserResult = User | Users;
