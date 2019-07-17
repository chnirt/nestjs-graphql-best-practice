import { Injectable } from '@nestjs/common'
import { CommonService } from '../common/services/common.service'
import { Menu } from './menu.entity'
import { ApolloError } from 'apollo-server-core'
import { MenuInfo, DishInput } from '../../graphql'
import { v1 as uuidv1 } from 'uuid'

@Injectable()
export class MenuService {
	constructor(private readonly commonService: CommonService) {}
	async getMenus(): Promise<Menu[] | ApolloError> {
		try {
			return await this.commonService.findAdapter(Menu, { isActive: true })
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async getMenu(id: string): Promise<Menu | ApolloError> {
		try {
			return await this.commonService.findOneAdapter(Menu, { _id: id })
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async getMenusBySite(siteId: string): Promise<Menu | ApolloError> {
		try {
			return await this.commonService.findAdapter(Menu, {
				siteId,
				isActive: true
			})
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async getMenuPublishBySite(siteId: string): Promise<Menu | ApolloError> {
		try {
			return await this.commonService.findOneAdapter(Menu, {
				siteId,
				isPublished: true,
				isActive: true
			})
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async createMenu(
		name: string,
		siteId: string
	): Promise<boolean | ApolloError> {
		try {
			return (await this.commonService.createAdapter(Menu, {
				name,
				siteId
			}))
				? true
				: false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async updateMenu(
		id: string,
		menuInfo: MenuInfo
	): Promise<boolean | ApolloError> {
		try {
			return (await this.commonService.updateOneByIdAdapter(Menu, id, {
				$set: { ...menuInfo }
			}))
				? true
				: false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async publishAndUnpublish(id: string): Promise<boolean | ApolloError> {
		try {
			const menu = await this.getMenu(id)
			return (await this.commonService.updateOneByIdAdapter(Menu, id, {
				$set: {
					isPublished: !menu.isPublished
				}
			}))
				? true
				: false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async lockAndUnlockMenu(id: string): Promise<boolean | ApolloError> {
		try {
			const menu = await this.getMenu(id)
			return (await this.commonService.updateOneByIdAdapter(Menu, id, {
				$set: {
					isLocked: !menu.isLocked
				}
			}))
				? true
				: false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async deleteMenu(id: string): Promise<boolean | ApolloError> {
		try {
			return await this.commonService.deleteAdapter(Menu, id)
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	// async addDish(
	// 	id: string,
	// 	dishInput: DishInput
	// ): Promise<boolean | ApolloError> {
	// 	try {
	// 		const menu = await this.commonService.findOneAdapter(Menu, { _id: id })
	// 		menu.dishes.push({ _id: await uuidv1(), ...dishInput })
	// 		return (await this.commonService.updateOneByIdAdapter(Menu, id, {
	// 			$set: {
	// 				dishes: await menu.dishes
	// 			}
	// 		}))
	// 			? true
	// 			: false
	// 	} catch (error) {
	// 		throw new ApolloError(error)
	// 	}
	// }

	// async updateDish(
	// 	menuId: string,
	// 	dishId: string,
	// 	dishInput: DishInput
	// ): Promise<boolean | ApolloError> {
	// 	try {
	// 		return (await this.commonService.updateManyAdapter(
	// 			Menu,
	// 			{ '_id': menuId, 'dishes._id': dishId },
	// 			{
	// 				$set: {
	// 					'dishes.$': { ...dishInput, _id: dishId }
	// 				}
	// 			}
	// 		))
	// 			? true
	// 			: false
	// 	} catch (error) {
	// 		throw new ApolloError(error)
	// 	}
	// }

	// async deleteDish(
	// 	menuId: string,
	// 	dishId: string
	// ): Promise<boolean | ApolloError> {
	// 	try {
	// 		const menu = await this.commonService.findOneAdapter(Menu, { _id: menuId })
	// 		const dishes = await menu.dishes.filter(dish => dish._id !== dishId)
	// 		return (await this.commonService.updateOneByIdAdapter(Menu, menuId, {
	// 			$set: {
	// 				dishes
	// 			}
	// 		}))
	// 			? true
	// 			: false
	// 	} catch (error) {
	// 		throw new ApolloError(error)
	// 	}
	// }

	async closeMenu(id: string): Promise<boolean | ApolloError> {
		try {
			const menu = await this.commonService.findOneAdapter(Menu, {
				_id: id,
				isActive: true
			})
			if (menu) {
				await this.commonService.updateOneByIdAdapter(Menu, id, {
					$set: {
						isActive: false,
						isLocked: true,
						isPublished: false
					}
				})
				return (await this.commonService.createAdapter(Menu, {
					name: menu.name,
					siteId: menu.siteId
				}))
					? true
					: false
			}
		} catch (error) {
			throw new ApolloError(error)
		}
	}
}
