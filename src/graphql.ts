
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum RoleEnum {
    MEMBER = "MEMBER",
    MANAGER = "MANAGER",
    ADMIN = "ADMIN"
}

export class CreateUserInput {
    username: string;
    password: string;
    email: string;
}

export class LoginUserInput {
    username: string;
    password: string;
}

export class CreateSiteInput {
    name: string;
    address: string;
    phone: string;
}

export class LoginResponse {
    token: string;
}

export abstract class IMutation {
    abstract register(input: CreateUserInput): User | Promise<User>;

    abstract updateUser(_id: string, input: CreateUserInput): boolean | Promise<boolean>;

    abstract deleteUser(_id: string): boolean | Promise<boolean>;

    abstract deleteAll(): boolean | Promise<boolean>;

    abstract login(input: LoginUserInput): LoginResponse | Promise<LoginResponse>;

    abstract setRole(_id: string, role: RoleEnum): boolean | Promise<boolean>;
}

export abstract class IQuery {
    abstract dishes(): string | Promise<string>;

    abstract sites(): string | Promise<string>;

    abstract hello(): string | Promise<string>;

    abstract me(): User | Promise<User>;

    abstract users(offset: number, limit: number): User[] | Promise<User[]>;

    abstract user(_id: string): User | Promise<User>;
}

export class Site {
    _id: string;
    name: string;
    address: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

export abstract class ISubscription {
    abstract userCreated(): User | Promise<User>;
}

export class User {
    _id: string;
    username: string;
    password: string;
    email: string;
    role: RoleEnum;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}
