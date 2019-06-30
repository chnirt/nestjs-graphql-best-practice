
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

export class CreateSiteInput {
    name: string;
    address: string;
    phone: string;
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

export class UpdateSiteInput {
    name?: string;
    address?: string;
    phone?: string;
}

export class UpdateUserInput {
    username?: string;
    password?: string;
    email?: string;
}

export class LoginResponse {
    token: string;
}

export abstract class IMutation {
    abstract createSite(input: CreateSiteInput): Site | Promise<Site>;

    abstract updateSite(_id: string, input: UpdateSiteInput): boolean | Promise<boolean>;

    abstract deleteSite(_id: string): boolean | Promise<boolean>;

    abstract deleteSites(): boolean | Promise<boolean>;

    abstract register(input: CreateUserInput): User | Promise<User>;

    abstract updateUser(_id: string, input: UpdateUserInput): boolean | Promise<boolean>;

    abstract deleteUser(_id: string): boolean | Promise<boolean>;

    abstract deleteUsers(): boolean | Promise<boolean>;

    abstract login(input: LoginUserInput): LoginResponse | Promise<LoginResponse>;

    abstract setRole(_id: string, role: RoleEnum): boolean | Promise<boolean>;
}

export abstract class IQuery {
    abstract dishes(): string | Promise<string>;

    abstract sites(): Site[] | Promise<Site[]>;

    abstract site(_id: string): Site | Promise<Site>;

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
