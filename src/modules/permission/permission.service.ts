import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Permission } from './permission.entity'
import { MongoRepository } from 'typeorm'
import { CreatePermissionInput, UpdatePermissionInput } from '../../graphql'

@Injectable()
export class PermissionService {
	constructor(
		@InjectRepository(Permission)
		private readonly permissionRepository: MongoRepository<Permission>
	) {}

	async findAll(): Promise<Permission[]> {
		return await this.permissionRepository.find({
			cache: true
		})
	}

	async findById(_id: string): Promise<Permission> {
		const message = 'Permission is not found.'

		const permission = await this.permissionRepository.findOne({ _id })

		if (!permission) {
			throw new Error(message)
		}

		return permission
	}

	async create(input: CreatePermissionInput): Promise<Permission> {
		const { code, description } = input

		const permission = new Permission()
		permission.code = code
		permission.description = description

		return await this.permissionRepository.save(permission)
	}

	async update(_id: string, input: UpdatePermissionInput): Promise<boolean> {
		const message = 'Permission is not found.'
		const { code, description } = input

		const permission = await this.permissionRepository.findOne({ _id })

		if (!permission) {
			throw new Error(message)
		}

		permission.code = code
		permission.description = description

		return (await this.permissionRepository.save(permission)) ? true : false
	}

	async delete(_id: string): Promise<boolean> {
		const message = 'Permission is not found.'

		const permission = await this.permissionRepository.findOne({ _id })

		if (!permission) {
			throw new Error(message)
		}

		return (await this.permissionRepository.remove(permission)) ? true : false
	}

	async deleteAll(): Promise<boolean> {
		return (await this.permissionRepository.deleteMany({})) ? true : false
	}
}
