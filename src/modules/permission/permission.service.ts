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
		return await this.permissionRepository.findOne({ _id })
	}

	async create(input: CreatePermissionInput): Promise<Permission> {
		const { code, description } = input

		const permission = new Permission()
		permission.code = code
		permission.description = description

		return await this.permissionRepository.save(permission)
	}

	async update(_id: string, input: UpdatePermissionInput): Promise<boolean> {
		// const { code, description } = input

		const updatedUser = await this.permissionRepository.findOneAndUpdate(
			{ _id },
			{ $set: { ...input } },
			{ returnOriginal: false }
		)

		return (await this.permissionRepository.save(updatedUser.value))
			? true
			: false
	}

	async delete(_id: string): Promise<boolean> {
		const permission = await this.permissionRepository.findOne({ _id })
		return (await this.permissionRepository.remove(permission)) ? true : false
	}

	async deleteAll(): Promise<boolean> {
		return (await this.permissionRepository.deleteMany({})) ? true : false
	}
}
