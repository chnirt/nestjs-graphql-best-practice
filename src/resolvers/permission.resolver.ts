import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'

import { Permission } from '@entities'
import { ApolloError } from 'apollo-server-core'
import { PermissionInput } from '../generator/graphql.schema'

@Resolver('Permission')
export class PermissionResolver {
	@Query()
	async permissions(): Promise<Permission[]> {
		return getMongoRepository(Permission).find({
			where: { isActive: true },
			cache: true
		})
	}

	@Mutation()
	async createPermission(
		@Args('input') input: PermissionInput
	): Promise<boolean> {
		try {
			const data = await getMongoRepository(Permission).findOne({
				code: input.code,
				isActive: true
			})
			if (!data) {
				return (await getMongoRepository(Permission).save(
					new Permission({ ...input })
				))
					? true
					: false
			} else {
				return false
			}
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation()
	async updatePermission(
		@Args('id') id: string,
		@Args('input') input: PermissionInput
	): Promise<boolean> {
		try {
			const permission = await getMongoRepository(Permission).findOne({
				_id: id,
				isActive: true
			})
			if (permission) {
				const data = await getMongoRepository(Permission).findOne({
					code: input.code,
					isActive: true
				})
				if (!data || data._id === id) {
					return (await getMongoRepository(Permission).save(
						new Permission({ ...permission, ...input })
					))
						? true
						: false
				} else {
					return false
				}
			} else {
				return false
			}
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Mutation()
	async deletePermission(@Args('id') id: string) {
		try {
			const data = await getMongoRepository(Permission).findOne({ _id: id })
			if (data) {
				return (await getMongoRepository(Permission).save(
					new Permission({ ...data, isActive: false })
				))
					? true
					: false
			} else {
				return false
			}
		} catch (error) {
			throw new ApolloError(error)
		}
	}
}
