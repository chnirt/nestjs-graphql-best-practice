
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class CreatePermissionInput {
    code: string;
    description: string;
}

export class CreateSiteInput {
    name: string;
}

export class CreateUserInput {
    username: string;
    password: string;
    fullName: string;
}

export class CreateUserPermissionInput {
    userId: string;
    siteId: string;
}

export class LoginUserInput {
    username: string;
    password: string;
}

export class UpdatePermissionInput {
    code?: string;
    description?: string;
}

export class UpdateSiteInput {
    name?: string;
}

export class UpdateUserInput {
    fullName?: string;
}

export class UpdateUserPermissionInput {
    userId: string;
    siteId: string;
}

export class Dish {
    _id: string;
    title: string;
    description: string;
    price: number;
    creator: User;
    createdAt: string;
    updatedAt: string;
}

export class DishInfo {
    _id?: string;
    name?: string;
    count?: number;
}

export class LoginResponse {
    token: string;
}

export class Menu {
    _id?: string;
    name?: string;
    siteId?: string;
    dishes?: DishInfo[];
    isPublish?: boolean;
    isLocked?: boolean;
    createAt?: string;
    updateAt?: string;
}

export abstract class IMutation {
    abstract createPermission(input: CreatePermissionInput): Permission | Promise<Permission>;

    abstract updatePermission(_id: string, input: UpdatePermissionInput): boolean | Promise<boolean>;

    abstract deletePermission(_id: string): boolean | Promise<boolean>;

    abstract deletePermissions(): boolean | Promise<boolean>;

    abstract createSite(input: CreateSiteInput): Site | Promise<Site>;

    abstract updateSite(_id: string, input: UpdateSiteInput): boolean | Promise<boolean>;

    abstract deleteSite(_id: string): boolean | Promise<boolean>;

    abstract deleteSites(): boolean | Promise<boolean>;

    abstract register(input: CreateUserInput): User | Promise<User>;

    abstract updateUser(_id: string, input: UpdateUserInput): boolean | Promise<boolean>;

    abstract deleteUser(_id: string): boolean | Promise<boolean>;

    abstract deleteUsers(): boolean | Promise<boolean>;

    abstract login(input: LoginUserInput): LoginResponse | Promise<LoginResponse>;

    abstract lockAndUnlock(_id: string): boolean | Promise<boolean>;

    abstract createUserPermission(input: CreateUserPermissionInput): UserPermission | Promise<UserPermission>;

    abstract updateUserPermission(_id: string, input: UpdateUserPermissionInput): boolean | Promise<boolean>;

    abstract deleteUserPermission(_id: string): boolean | Promise<boolean>;

    abstract deleteUserPermissions(): boolean | Promise<boolean>;
}

export class Order {
    _id?: string;
    userId?: string;
    menuId?: string;
    dishId?: string;
    note?: string;
    count?: number;
    isConfirmed?: boolean;
    createAt?: string;
    updateAt?: string;
}

export class Permission {
    _id: string;
    code: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export abstract class IQuery {
    abstract dishes(): string | Promise<string>;

    abstract getMenuById(id: string): Menu | Promise<Menu>;

    abstract getMenus(): Menu[] | Promise<Menu[]>;

    abstract getOrderById(id: string): Order | Promise<Order>;

    abstract getOrders(): Order[] | Promise<Order[]>;

    abstract permissions(): Permission[] | Promise<Permission[]>;

    abstract permission(_id: string): Permission | Promise<Permission>;

    abstract sites(): Site[] | Promise<Site[]>;

    abstract site(_id: string): Site | Promise<Site>;

    abstract hello(): string | Promise<string>;

    abstract me(): User | Promise<User>;

    abstract users(offset: number, limit: number): User[] | Promise<User[]>;

    abstract user(_id: string): User | Promise<User>;

    abstract userPermissions(): UserPermission[] | Promise<UserPermission[]>;

    abstract userPermission(_id: string): UserPermission | Promise<UserPermission>;

    abstract getPermissionsByUserId(id: string): Permission[] | Promise<Permission[]>;
}

export class Site {
    _id: string;
    name: string;
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
    fullName: string;
    isLocked: boolean;
    reason: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export class UserPermission {
    _id: string;
    userId: string;
    siteId: string;
    permissions: Permission[];
}
