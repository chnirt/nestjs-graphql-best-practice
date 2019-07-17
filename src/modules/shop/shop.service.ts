import { Injectable } from '@nestjs/common'
import { CommonService } from '../common/services/common.service'
import { ShopInput } from '../../graphql'
import { ApolloError } from 'apollo-server-core'
import { Shop } from './shop.entity'
import { v1 as uuidv1 } from 'uuid'

@Injectable()
export class ShopService {
  constructor(private readonly commonService: CommonService) {}

  async getAllShops(): Promise<Shop[] | ApolloError> {
    try {
      return this.commonService.findAdapter(Shop, { isActive: true })
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  async getShop(id: string): Promise<Shop | ApolloError> {
    try {
      return await this.commonService.findOneAdapter(Shop, {_id: id})
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  async getShopsBySite(siteId: string): Promise<Shop[] | ApolloError> {
    try {
      return this.commonService.findAdapter(Shop, { siteId, isActive: true })
    } catch (error) {
      throw new ApolloError(error)
    }
  }

	async createShop(input: ShopInput): Promise<boolean | ApolloError> {
		try {
			return await this.commonService.createAdapter(Shop, { ...input }) ? true : false
		} catch (error) {
			throw new ApolloError(error)
		}
  }

  async deleteShop(id: string): Promise<boolean | ApolloError> {
    try {
      return await this.commonService.deleteAdapter(Shop, id)
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  async addDish(id: string, name: string): Promise<boolean | ApolloError> {
    try {
      const shop = await this.commonService.findOneAdapter(Shop, { _id: id })
      shop.dishes.push({ _id: await uuidv1(), name, count: 0 })
      return (await this.commonService.updateOneByIdAdapter(Shop, id, {
				$set: {
					dishes: await shop.dishes
				}
			}))
				? true
				: false
    } catch (error) {
      throw new ApolloError(error)
    }
  }

  async updateDish(id: string, dishId: string, name: string): Promise<boolean | ApolloError> {
    try {
      return (await this.commonService.updateManyAdapter(
				Shop,
				{ '_id': id, 'dishes._id': dishId },
				{
					$set: {
						'dishes.$': { _id: dishId, name, count: 0 }
					}
				}
			))
				? true
				: false
    } catch (error) {
      throw new ApolloError(error)
    }
  }
}
