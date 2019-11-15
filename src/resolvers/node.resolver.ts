import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError, ApolloError } from 'apollo-server-core'
import { User } from './../models/user.entity'

import { Node } from '@models'
import {
	CreateNodeInput,
	SearchNodeInput,
	NodeCategory,
	UpdateNodeInput
} from '../generator/graphql.schema'

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

		const data = await getMongoRepository(Node).find({
			cache: true
		})

		return data
	}

	@Mutation()
	async createNode(@Args('input') input: CreateNodeInput): Promise<Node> {
		const repo = getMongoRepository(Node)
		const data = await repo.findOne({
			where: { name: input.name },
			cache: true
		})
		if (data) {
			throw new ForbiddenError('Node already existed.')
		}

		return await repo.save(new Node(input))
	}

	@Mutation()
	async updateNode(
		@Args('_id') _id: string,
		@Args('input') input: UpdateNodeInput
	) {
		const repo = getMongoRepository(Node)
		const data = await repo.findOne({
			where: { name: input.name },
			cache: true
		})
		if (data && data._id !== _id) {
			throw new ForbiddenError('Node already existed.')
		}
		return await repo.save(new Node({ _id, ...input }))
	}

	@Mutation()
	async deleteNode(@Args('_id') _id: string) {
		const repo = getMongoRepository(Node)
		const data = await repo.findOne({
			where: { _id },
			cache: true
		})
		if (!data) {
			throw new ForbiddenError('Node not found.')
		}

		return await repo.save(new Node({ ...data, isActive: false }))
	}

	// @Mutation()
	// async createNode(@Args('input') input: CreateNodeInput): Promise<Node> {
	// 	const { parentId, name, category } = input
	// 	// }
	// 	const { CITY, STORE, DEPARTMENT, POSITION, JOB } = NodeCategory

	// 	let foundNode
	// 	let node

	// 	switch (category) {
	// 		case CITY:
	// 			foundNode = await getMongoRepository(Node).findOne({
	// 				where: {
	// 					city: {
	// 						name
	// 					}
	// 				}
	// 			})

	// 			if (foundNode) {
	// 				throw new ForbiddenError('Node already existed.')
	// 			}

	// 			node = {
	// 				...input,
	// 				city: {
	// 					name
	// 				}
	// 			}
	// 			break

	// 		case STORE:
	// 			foundNode = await getMongoRepository(Node).findOne({
	// 				where: {
	// 					store: {
	// 						name
	// 					}
	// 				}
	// 			})

	// 			if (foundNode) {
	// 				throw new ForbiddenError('Node already existed.')
	// 			}

	// 			node = {
	// 				...input,
	// 				store: {
	// 					name
	// 				}
	// 			}
	// 			break

	// 		case DEPARTMENT:
	// 			foundNode = await getMongoRepository(Node).findOne({
	// 				where: {
	// 					department: {
	// 						name
	// 					}
	// 				}
	// 			})

	// 			if (foundNode) {
	// 				throw new ForbiddenError('Node already existed.')
	// 			}

	// 			node = {
	// 				...input,
	// 				department: {
	// 					name
	// 				}
	// 			}
	// 			break

	// 		case POSITION:
	// 			foundNode = await getMongoRepository(Node).findOne({
	// 				where: {
	// 					position: {
	// 						name
	// 					}
	// 				}
	// 			})

	// 			if (foundNode) {
	// 				throw new ForbiddenError('Node already existed.')
	// 			}

	// 			node = {
	// 				...input,
	// 				position: {
	// 					name
	// 				}
	// 			}
	// 			break

	// 		case JOB:
	// 			foundNode = await getMongoRepository(Node).findOne({
	// 				where: {
	// 					job: {
	// 						name
	// 					}
	// 				}
	// 			})

	// 			if (foundNode) {
	// 				throw new ForbiddenError('Node already existed.')
	// 			}

	// 			node = {
	// 				...input,
	// 				job: {
	// 					name
	// 				}
	// 			}
	// 			break

	// 		default:
	// 			if (parentId) {
	// 				throw new ForbiddenError('category is COMPANY don\'t need parentId.')
	// 			}

	// 			foundNode = await getMongoRepository(Node).findOne({
	// 				where: {
	// 					company: {
	// 						name
	// 					}
	// 				}
	// 			})

	// 			if (foundNode) {
	// 				throw new ForbiddenError('Node already existed.')
	// 			}

	// 			node = {
	// 				...input,
	// 				company: {
	// 					name
	// 				}
	// 			}
	// 	}

	// 	const newNode = await getMongoRepository(Node).save(
	// 		new Node({
	// 			...node
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
	// 	return null
	// }
}
