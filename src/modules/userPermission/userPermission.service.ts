import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserPermission } from './userPermission.entity'
import { MongoRepository } from 'typeorm'
import {
	CreateUserPermissionInput,
	UpdateUserPermissionInput
} from '../../graphql'

@Injectable()
export class UserPermissionService {
	constructor(
		@InjectRepository(UserPermission)
		private readonly userPermissionRepository: MongoRepository<UserPermission>
	) {}

	async findAll(): Promise<UserPermission[]> {
		return await this.userPermissionRepository.find({
			cache: true
		})
	}

	async findById(_id: string): Promise<UserPermission> {
		const message = 'UserPermission is not found.'

		const site = await this.userPermissionRepository.findOne({ _id })

		if (!site) {
			throw new Error(message)
		}

		return site
	}

	async create(input: CreateUserPermissionInput): Promise<UserPermission> {
		const { userId, siteId } = input

		const userPermission = new UserPermission()
		userPermission.userId = userId
		userPermission.userId = siteId
		// userPermission.permissions = permissions

		return await this.userPermissionRepository.save(userPermission)
	}

	async update(_id: string, input: UpdateUserPermissionInput): Promise<boolean> {
		const message = 'UserPermission is not found.'
		// const { permissions } = input

		const userPermission = await this.userPermissionRepository.findOne({ _id })

		if (!userPermission) {
			throw new Error(message)
		}

		// userPermission.permissions = permissions

		return (await this.userPermissionRepository.save(userPermission))
			? true
			: false
	}

	async delete(_id: string): Promise<boolean> {
		const message = 'UserPermission is not found.'

		const site = await this.userPermissionRepository.findOne({ _id })

		if (!site) {
			throw new Error(message)
		}

		return (await this.userPermissionRepository.remove(site)) ? true : false
	}

	async deleteAll(): Promise<boolean> {
		return (await this.userPermissionRepository.deleteMany({})) ? true : false
	}
}
