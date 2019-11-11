import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { Node } from '@models'
import {
	CreateNodeInput,
	SearchNodeInput,
	NodeCategory,
} from '../generator/graphql.schema'
import { NotFoundException } from '@nestjs/common'

@Resolver('Node')
export class NodeResolver {
	@Query()
	async nodes(): Promise<Node[]> {
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
			cache: true,
		})
	}

	@Mutation()
	async createNode(@Args('input') input: CreateNodeInput): Promise<Node> {
		const { parentId, name, category } = input
		// }
		const { CITY, STORE, DEPARTMENT, POSITION, JOB } = NodeCategory

		let foundNode
		let node

		switch (category) {
			case CITY:
				foundNode = await getMongoRepository(Node).findOne({
					where: {
						city: {
							name,
						},
					},
				})

				if (foundNode) {
					throw new ForbiddenError('Node already existed.')
				}

				node = {
					...input,
					city: {
						name,
					},
				}
				break

			case STORE:
				foundNode = await getMongoRepository(Node).findOne({
					where: {
						store: {
							name,
						},
					},
				})

				if (foundNode) {
					throw new ForbiddenError('Node already existed.')
				}

				node = {
					...input,
					store: {
						name,
					},
				}
				break

			case DEPARTMENT:
				foundNode = await getMongoRepository(Node).findOne({
					where: {
						department: {
							name,
						},
					},
				})

				if (foundNode) {
					throw new ForbiddenError('Node already existed.')
				}

				node = {
					...input,
					department: {
						name,
					},
				}
				break

			case POSITION:
				foundNode = await getMongoRepository(Node).findOne({
					where: {
						position: {
							name,
						},
					},
				})

				if (foundNode) {
					throw new ForbiddenError('Node already existed.')
				}

				node = {
					...input,
					position: {
						name,
					},
				}
				break

			case JOB:
				foundNode = await getMongoRepository(Node).findOne({
					where: {
						job: {
							name,
						},
					},
				})

				if (foundNode) {
					throw new ForbiddenError('Node already existed.')
				}

				node = {
					...input,
					job: {
						name,
					},
				}
				break

			default:
				if (parentId) {
					throw new ForbiddenError("category is COMPANY don't need parentId.")
				}

				foundNode = await getMongoRepository(Node).findOne({
					where: {
						company: {
							name,
						},
					},
				})

				if (foundNode) {
					throw new ForbiddenError('Node already existed.')
				}

				node = {
					...input,
					company: {
						name,
					},
				}
		}

		const newNode = await getMongoRepository(Node).save(
			new Node({
				...node,
			}),
		)

		return newNode
	}

	@Mutation()
	async updateNode(
		@Args('_id') _id: string,
		@Args('parentId') parentId: string,
	): Promise<Node> {
		const node = await getMongoRepository(Node).findOne({ _id })

		if (!node) {
			throw new ForbiddenError('Node not found.')
		}

		// const nodeByParentId = await getMongoRepository(Node).findOne({
		// 	_id: parentId
		// })

		// if (!nodeByParentId) {
		// 	throw new ForbiddenError('Node by parentId not found.')
		// }

		// node.parentId = parentId
		// node.path = nodeByParentId.path

		// const updatedNode = await getMongoRepository(Node).save(
		// 	new Node({ ...node })
		// )

		// return updatedNode
		return null
	}
}
