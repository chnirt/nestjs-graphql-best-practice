import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { Node } from '../models'
import { CreateNodeInput } from '../generator/graphql.schema'
import { SearchNodeInput, NodeCategory } from '../generator/graphql.schema'

@Resolver('Node')
export class NodeResolver {
	@Query()
	async nodes(@Args('input') input: SearchNodeInput): Promise<Node[]> {
		console.log('aaaa')
		console.log(input && input)
		// const whereArray = [text, code]
		// // const obj = { name: { $regex: ele, $options: 'si' } }
		// const where = {}
		// const filter = whereArray
		// 	.filter(item => item)
		// 	// .map(item => {
		// 	// 	return where.push(`${item}`: { $regex: item, $options: 'si' })
		// 	// })
		// 	.map((ele, i) => ({
		// 		...(!i
		// 			? { name: { $regex: ele, $options: 'si' } }
		// 			: { code: { $regex: ele, $options: 'si' } })
		// 	}))
		// console.log(filter)
		// if (text || code) {
		// 	/**
		// 	 * @type i: USER | user upper lower
		// 	 * @type s: space | enter is removed
		// 	 */
		// 	const node = await getMongoRepository(Node).find({
		// 		where: {
		// 			name: { $regex: text, $options: 'si' },
		// 			code: { $regex: code, $options: 'si' }
		// 		},
		// 		cache: true
		// 	})

		// 	if (!node) {
		// 		throw new ForbiddenError('Node not found.')
		// 	}

		// 	return node
		// }

		return await getMongoRepository(Node).find({
			cache: true
		})
	}

	@Mutation()
	async createNode(@Args('input') input: CreateNodeInput): Promise<Node> {
		const { parentId, code, category } = input

		// const node = await getMongoRepository(Node).findOne({ code })

		// if (node) {
		// 	throw new ForbiddenError('Node already exists.')
		// }

		if (parentId) {
			if (category === NodeCategory.COMPANY && parentId.length >= 0) {
				throw new ForbiddenError('category is COMPANY dont need parentId.')
			}

			const nodeByParentId = await getMongoRepository(Node).findOne({
				_id: parentId
			})

			if (!nodeByParentId) {
				throw new ForbiddenError('Node not found.')
			}

			const path = `${nodeByParentId.path}/${code}`

			const node = await getMongoRepository(Node).findOne({ path })

			if (node) {
				throw new ForbiddenError('Node already exists.')
			}

			const newNode = await getMongoRepository(Node).save(
				new Node({ ...input, path: nodeByParentId.path })
			)

			return newNode
		}

		const newNode = await getMongoRepository(Node).save(new Node({ ...input }))

		return newNode
	}

	@Mutation()
	async updateNode(
		@Args('_id') _id: string,
		@Args('parentId') parentId: string
	): Promise<Node> {
		const node = await getMongoRepository(Node).findOne({ _id })

		if (!node) {
			throw new ForbiddenError('Node not found.')
		}

		const nodeByParentId = await getMongoRepository(Node).findOne({
			_id: parentId
		})

		if (!nodeByParentId) {
			throw new ForbiddenError('Node by parentId not found.')
		}

		node.parentId = parentId
		node.path = nodeByParentId.path

		const updatedNode = await getMongoRepository(Node).save(
			new Node({ ...node })
		)

		return updatedNode
	}
}
