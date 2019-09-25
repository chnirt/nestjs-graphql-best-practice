import {
	Resolver,
	Query,
	Args,
	Mutation,
	Subscription,
	Context
} from '@nestjs/graphql'
import { MenuInfo } from '../../graphql.schema'
import { MongoRepository } from 'typeorm'
import { ApolloError } from 'apollo-server-core'
import { InjectRepository } from '@nestjs/typeorm'
import { Menu } from '../../models'

@Resolver('menu')
export class MenuResolver {
	constructor(
		@InjectRepository(Menu)
		private readonly menuRepository: MongoRepository<Menu>
	) {}

	@Query('menus')
	async getMenus(): Promise<Menu[]> {
		try {
			return await this.menuRepository.find({
				where: { isActive: true },
				order: { createAt: 'DESC' }
			})
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Query('menu')
	async getMenu(@Args('id') id: string): Promise<Menu> {
		try {
			return await this.menuRepository.findOne({ _id: id })
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Query('menusBySite')
	async getMenusBySite(@Args('siteId') siteId: string): Promise<Menu[]> {
		try {
			return await this.menuRepository.find({
				where: { siteId, isActive: true },
				order: { createAt: 'DESC' }
			})
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Query('menuPublishBySite')
	async getMenuPublishBySite(@Args('siteId') siteId: string): Promise<Menu> {
		try {
			return await this.menuRepository.findOne({
				siteId,
				isPublished: true,
				isActive: true
			})
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation('createMenu')
	async createMenu(
		@Args('name') name: string,
		@Args('siteId') siteId: string
	): Promise<boolean> {
		try {
			return (await this.menuRepository.save(new Menu({ name, siteId })))
				? true
				: false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation('updateMenu')
	async updateMenu(
		@Args('id') id: string,
		@Args('menuInfo') menuInfo: MenuInfo
	): Promise<boolean> {
		try {
			const updatedMenu = await this.menuRepository.findOneAndUpdate(
				{ _id: id },
				{ $set: { ...menuInfo } },
				{ returnOriginal: false }
			)
			return (await this.menuRepository.save(updatedMenu.value)) ? true : false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation('publishAndUnpublish')
	async publishAndUnpublish(
		@Args('id') id: string,
		@Context('pubSub') pubSub: any
	): Promise<boolean> {
		try {
			const menu = await this.menuRepository.findOne({ _id: id })
			menu.isPublished = !menu.isPublished
			pubSub.publish('menuSubscription', { menuSubscription: menu })
			return (await this.menuRepository.save(menu)) ? true : false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation('lockAndUnlockMenu')
	async lockAndUnlockMenu(
		@Args('id') id: string,
		@Context('pubSub') pubSub: any
	): Promise<boolean> {
		try {
			const menu = await this.menuRepository.findOne({ _id: id })
			menu.isLocked = !menu.isLocked
			pubSub.publish('menuSubscription', { menuSubscription: menu })
			return (await this.menuRepository.save(menu)) ? true : false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation('deleteMenu')
	async deleteMenu(@Args('id') id: string): Promise<boolean> {
		try {
			const deletedMenu = await this.menuRepository.findOneAndUpdate(
				{ _id: id },
				{ $set: { isActive: false } },
				{ returnOriginal: false }
			)
			return (await this.menuRepository.save(deletedMenu.value)) ? true : false
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation('closeMenu')
	async closeMenu(
		@Args('id') id: string,
		@Context('pubSub') pubSub: any
	): Promise<boolean> {
		try {
			const menu = await this.menuRepository.findOne({
				_id: id,
				isActive: true
			})
			if (menu) {
				const closedMenu = await this.menuRepository.findOneAndUpdate(
					{ _id: id },
					{
						$set: {
							isActive: false,
							isLocked: true,
							isPublished: false
						}
					},
					{ returnOriginal: false }
				)
				await this.menuRepository.save(closedMenu.value)
				pubSub.publish('menuSubscription', {
					menuSubscription: closedMenu.value
				})
				return (await this.menuRepository.save(
					new Menu({ name: menu.name, siteId: menu.siteId })
				))
					? true
					: false
			}
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Subscription()
	async menuSubscription(@Context('pubSub') pubSub: any) {
		return pubSub.asyncIterator('menuSubscription')
	}
}
