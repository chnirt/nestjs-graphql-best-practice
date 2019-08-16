
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class CreateHistoryInput {
    userId: string;
    description: string;
}

export class CreateOrderInput {
    menuId: string;
    dishId: string;
    note?: string;
    count: number;
}

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
    sites: SitesInfoInput[];
}

export class CreateUserPermissionInput {
    userId: string;
    siteId: string;
    permissions: PermissionInfoInput[];
}

export class DishInput {
    _id?: string;
    name?: string;
    count?: number;
}

export class LoginUserInput {
    username: string;
    password: string;
}

export class MenuInfo {
    name?: string;
    shopId?: string;
    dishes?: DishInput[];
}

export class OrderJInput {
    menuId: string;
    dishId: string;
    count: number;
}

export class PermissionInfoInput {
    _id: string;
    code: string;
}

export class SitesInfoInput {
    siteId: string;
    permissions: PermissionInfoInput[];
}

export class UpdateOrderInput {
    menuId: string;
    dishId: string;
    note?: string;
    count?: number;
}

export class UpdatePermissionInput {
    code?: string;
    description?: string;
}

export class UpdateSiteInput {
    name?: string;
}

export class UpdateUserInput {
    password: string;
    fullName: string;
    sites: SitesInfoInput[];
}

export class Dish {
    _id?: string;
    name?: string;
    isActive?: boolean;
    shopId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export class DishInfo {
    _id?: string;
    name?: string;
    count?: number;
}

export class DishOrderJ {
    dishId: string;
    name: string;
    MyOrderQuantity: number;
    orderQuantityNow: number;
    orderQuantityMax: number;
}

export class History {
    _id: string;
    userId: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}

export class LoginResponse {
    token: string;
    userPermissions: UserPermissionsInfo[];
}

export class Menu {
    _id?: string;
    name?: string;
    siteId?: string;
    shopId?: string;
    dishes?: DishInfo[];
    isPublished?: boolean;
    isLocked?: boolean;
    isActive?: boolean;
    createAt?: string;
    updateAt?: string;
}

export class MenuOrderJ {
    menuId: string;
    dishes: DishOrderJ[];
    isPublished?: boolean;
    isLocked?: boolean;
}

export abstract class IMutation {
    abstract createDish(name: string, shopId: string): boolean | Promise<boolean>;

    abstract deleteDish(id: string): boolean | Promise<boolean>;

    abstract createHistory(input: CreateHistoryInput): History | Promise<History>;

    abstract createMenu(name: string, siteId: string): boolean | Promise<boolean>;

    abstract updateMenu(id: string, menuInfo: MenuInfo): boolean | Promise<boolean>;

    abstract publishAndUnpublish(id: string): boolean | Promise<boolean>;

    abstract lockAndUnlockMenu(id: string): boolean | Promise<boolean>;

    abstract deleteMenu(id: string): boolean | Promise<boolean>;

    abstract closeMenu(id: string): boolean | Promise<boolean>;

    abstract orderDish(input: CreateOrderInput): string | Promise<string>;

    abstract updateOrder(id: string, input: UpdateOrderInput): boolean | Promise<boolean>;

    abstract confirmOrder(orderIds?: string[]): boolean | Promise<boolean>;

    abstract deleteOrder(id?: string): boolean | Promise<boolean>;

    abstract orderJDish(input: OrderJInput): OrderJ | Promise<OrderJ>;

    abstract updateOrderJ(input: OrderJInput, userId: string): OrderJ | Promise<OrderJ>;

    abstract createPermission(input: CreatePermissionInput): Permission | Promise<Permission>;

    abstract updatePermission(_id: string, input: UpdatePermissionInput): boolean | Promise<boolean>;

    abstract deletePermission(_id: string): boolean | Promise<boolean>;

    abstract deletePermissions(): boolean | Promise<boolean>;

    abstract createShop(name: string): boolean | Promise<boolean>;

    abstract deleteShop(id: string): boolean | Promise<boolean>;

    abstract createSite(input: CreateSiteInput): Site | Promise<Site>;

    abstract updateSite(_id: string, input: UpdateSiteInput): boolean | Promise<boolean>;

    abstract deleteSite(_id: string): boolean | Promise<boolean>;

    abstract deleteSites(): boolean | Promise<boolean>;

    abstract createSiteShop(siteId: string, shopId: string): boolean | Promise<boolean>;

    abstract createUser(input: CreateUserInput): User | Promise<User>;

    abstract updateUser(_id: string, input: UpdateUserInput): boolean | Promise<boolean>;

    abstract deleteUser(_id: string): boolean | Promise<boolean>;

    abstract deleteUsers(): boolean | Promise<boolean>;

    abstract login(input: LoginUserInput): LoginResponse | Promise<LoginResponse>;

    abstract lockAndUnlockUser(_id: string, reason: string): boolean | Promise<boolean>;

    abstract createUserPermission(input: CreateUserPermissionInput): UserPermission | Promise<UserPermission>;
}

export class Order {
    _id: string;
    userId: string;
    menuId: string;
    dishId: string;
    note?: string;
    count: number;
    isConfirmed?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export class OrderCount {
    _id?: string;
    menuId?: string;
    count?: number;
}

export class OrderJ {
    _id: string;
    userId: string;
    menuId: string;
    dishId: string;
    note?: string;
    count: number;
    isConfirmed: boolean;
    createdAt: string;
    updatedAt: string;
}

export class OrderJSubscriptionRespone {
    menuId: string;
    dishId: string;
    orderQuantityNow: number;
    impactUserId: string;
    OrderQuantityOfImpactUser: number;
}

export class Permission {
    _id: string;
    code: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export class PermissionInfo {
    _id?: string;
    code?: string;
}

export abstract class IQuery {
    abstract dish(id: string): Dish | Promise<Dish>;

    abstract dishesByShop(shopId: string): Dish[] | Promise<Dish[]>;

    abstract histories(): History[] | Promise<History[]>;

    abstract menu(id: string): Menu | Promise<Menu>;

    abstract menus(): Menu[] | Promise<Menu[]>;

    abstract menusBySite(siteId: string): Menu[] | Promise<Menu[]>;

    abstract menuPublishBySite(siteId: string): Menu | Promise<Menu>;

    abstract order(id: string): Order | Promise<Order>;

    abstract orders(): Order[] | Promise<Order[]>;

    abstract ordersByUser(menuId: string): Order[] | Promise<Order[]>;

    abstract ordersByMenu(menuId: string): Order[] | Promise<Order[]>;

    abstract ordersCountByMenu(menuId: string): OrderCount[] | Promise<OrderCount[]>;

    abstract currentOrder(menuId: string, dishId: string): Order | Promise<Order>;

    abstract orderJs(): OrderJ[] | Promise<OrderJ[]>;

    abstract menuOrderJ(siteId: string): MenuOrderJ | Promise<MenuOrderJ>;

    abstract countByDishJ(dishId: string, menuId: string): OrderJ[] | Promise<OrderJ[]>;

    abstract countByMenuJ(menuId: string): OrderJ[] | Promise<OrderJ[]>;

    abstract permissions(): Permission[] | Promise<Permission[]>;

    abstract permission(_id: string): Permission | Promise<Permission>;

    abstract shops(): Shop[] | Promise<Shop[]>;

    abstract shop(id: string): Shop | Promise<Shop>;

    abstract sites(): Site[] | Promise<Site[]>;

    abstract sitesByIds(ids?: string[]): Site[] | Promise<Site[]>;

    abstract site(_id: string): Site | Promise<Site>;

    abstract siteShopsBySiteId(siteId: string): SiteShopResponse[] | Promise<SiteShopResponse[]>;

    abstract hello(): string | Promise<string>;

    abstract me(): User | Promise<User>;

    abstract users(offset?: number, limit?: number): User[] | Promise<User[]>;

    abstract user(_id: string): User | Promise<User>;

    abstract userPermissions(): UserPermission[] | Promise<UserPermission[]>;

    abstract findAllByUserId(_id: string): UserPermission[] | Promise<UserPermission[]>;
}

export class Shop {
    _id?: string;
    name?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export class Site {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export class SiteShop {
    _id?: string;
    siteId?: string;
    shopId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export class SiteShopResponse {
    siteId?: string;
    shopId?: string;
    name?: string;
}

export abstract class ISubscription {
    abstract menuSubscription(): Menu | Promise<Menu>;

    abstract ordersByMenuCreated(): OrderCount[] | Promise<OrderCount[]>;

    abstract isUpdatedOrder(): OrderJSubscriptionRespone | Promise<OrderJSubscriptionRespone>;

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
    siteName: string;
    permissions: PermissionInfo[];
    createdAt: string;
    updatedAt: string;
}

export class UserPermissionsInfo {
    siteId: string;
    siteName?: string;
    permissions: PermissionInfo[];
    sitepermissions: string[];
}
