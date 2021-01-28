import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { ForbiddenError } from 'apollo-server-core'
import { getMongoRepository } from 'typeorm'
import { Tree as TreeEntity } from '@entities'
import { Tree as TreeType } from '../generator/graphql.schema'

@Resolver('Tree')
export class TreeResolver {
	@Query()
	async tree(): Promise<TreeType> {
		return await getMongoRepository(TreeEntity).findOne({
			cache: true
		})
	}

	@Mutation()
	async createTree(@Args('input') input: string): Promise<string> {
		try {
			const result = await getMongoRepository(TreeEntity).save(
				new TreeEntity({ treeData: input })
			)
			return result._id
		} catch (err) {
			throw new Error(err)
		}
	}

	@Mutation()
	async updateTree(
		@Args('input') input: string,
		@Args('_id') _id: string
	): Promise<boolean> {
		try {
			const tree = await getMongoRepository(TreeEntity).findOne({ _id })
			if (!tree) {
				throw new ForbiddenError('Tree not found.')
			}
			const newTree = {
				...tree,
				treeData: input
			}
			const result = await getMongoRepository(TreeEntity).save(
				new TreeEntity({ ...newTree })
			)
			return true
		} catch (err) {
			throw new Error(err)
		}
	}
}
