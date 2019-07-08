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
			return await this.commonService.findAdapter(Menu, { isActived: true })
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

	async getMenuPublishBySite(
		currentSiteId: string
	): Promise<Menu | ApolloError> {
		try {
			return await this.commonService.findOneAdapter(Menu, {
				siteId: currentSiteId,
				isPublished: true,
				isActived: true
			})
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async createMenu(menuInfo: MenuInfo): Promise<boolean | ApolloError> {
		try {
			return (await this.commonService.createAdapter(Menu, menuInfo))
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

	async addDish(
		id: string,
		dishInput: DishInput
	): Promise<boolean | ApolloError> {
		try {
			const menu = await this.commonService.findOneAdapter(Menu, { _id: id })
			menu.dishes.push({ _id: await uuidv1(), ...dishInput })
			return (await this.commonService.updateOneByIdAdapter(Menu, id, {
				$set: {
					dishes: await menu.dishes
				}
			}))
				? true
				: false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async updateDish(
		menuId: string,
		dishId: string,
		dishInput: DishInput
	): Promise<boolean | ApolloError> {
		try {
			return (await this.commonService.updateManyAdapter(
				Menu,
				{ '_id': menuId, 'dishes._id': dishId },
				{
					$set: {
						'dishes.$': { ...dishInput, _id: dishId }
					}
				}
			))
				? true
				: false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	async closeMenu(id: string): Promise<boolean | ApolloError> {
		try {
			const { name, siteId } = await this.commonService.findOneAdapter(Menu, {
				_id: id
			})
			await this.commonService.updateOneByIdAdapter(Menu, id, {
				$set: {
					isActived: false,
					isLocked: true,
					isPublished: false
				}
			})
			return await this.createMenu({ name, siteId })
		} catch (error) {
			throw new ApolloError(error)
		}
	}
}
