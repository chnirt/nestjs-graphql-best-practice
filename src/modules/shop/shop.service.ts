import { Injectable } from '@nestjs/common'
import { CommonService } from '../common/services/common.service'
import { ApolloError } from 'apollo-server-core'
import { Shop } from './shop.entity'

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

	async createShop(name: string): Promise<boolean | ApolloError> {
		try {
			return await this.commonService.createAdapter(Shop, { name }) ? true : false
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

}
