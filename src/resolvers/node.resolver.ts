import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError, ApolloError } from 'apollo-server-core'
import { User } from './../models/user.entity'

import { Node } from '@models'
import {
	CreateNodeInput,
	SearchNodeInput,
	NodeCategory
} from '../generator/graphql.schema'

@Resolver('Node')
export class NodeResolver {
	@Query()
	async nodes(): Promise<Node[]> {
		try {
			return await getMongoRepository(Node).find({
				where: { isActive: true },
				cache: true
			})
		} catch (error) {
			throw new ApolloError(error)
		}
	}

	@Query()
	async searchNodes(@Args('input') input: SearchNodeInput): Promise<Node[]> {
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
	async createNode(
		@Args('input') input: CreateNodeInput,
		@Context('currentUser') currentUser: User
	): Promise<Node> {
		console.log(input)
		return null
		// 	const { parentId, code, category } = input

		// 	// const node = await getMongoRepository(Node).findOne({ code })

		// 	// if (node) {
		// 	// 	throw new ForbiddenError('Node already exists.')
		// 	// }

		// 	if (parentId) {
		// 		if (category === NodeCategory.SITE && parentId.length >= 0) {
		// 			throw new ForbiddenError('category is SITE dont need parentId.')
		// 		}

		// 		const nodeByParentId = await getMongoRepository(Node).findOne({
		// 			_id: parentId
		// 		})

		// 		if (!nodeByParentId) {
		// 			throw new ForbiddenError('Node not found.')
		// 		}

		// 		const node = await getMongoRepository(Node).findOne({ code })

		// 		if (node) {
		// 			throw new ForbiddenError('Node already exists.')
		// 		}

		// 		const newNode = await getMongoRepository(Node).save(
		// 			new Node({
		// 				...input,
		// 				createdBy: currentUser._id,
		// 				updatedBy: currentUser._id
		// 			})
		// 		)

		// 		return newNode
		// 	}

		// 	const newNode = await getMongoRepository(Node).save(
		// 		new Node({
		// 			...input,
		// 			createdBy: currentUser._id,
		// 			updatedBy: currentUser._id
		// 		})
		// 	)

		// 	return newNode
		// }

		// @Mutation()
		// async updateNode(
		// 	@Args('_id') _id: string,
		// 	@Args('parentId') parentId: string,
		// 	@Context('currentUser') currentUser: User
		// ): Promise<Node> {
		// 	const node = await getMongoRepository(Node).findOne({ _id })

		// 	if (!node) {
		// 		throw new ForbiddenError('Node not found.')
		// 	}

		// 	const nodeByParentId = await getMongoRepository(Node).findOne({
		// 		_id: parentId
		// 	})

		// 	if (!nodeByParentId) {
		// 		throw new ForbiddenError('Node by parentId not found.')
		// 	}

		// 	node.parentId = parentId
		// 	node.code = node.code.replace(/[A-Z]+_/, `${nodeByParentId.code}_`)

		// 	const updatedNode = await getMongoRepository(Node).save(
		// 		new Node({ ...node, updatedBy: currentUser._id })
		// 	)

		// 	return updatedNode
	}
}
