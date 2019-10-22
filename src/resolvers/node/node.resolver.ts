import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { Node } from '../../models'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { CreateNodeInput } from '../../generator/graphql.schema'
import { ForbiddenError } from 'apollo-server-core'
import { NodeCategory } from '../../generator/graphql.schema'

@Resolver('Node')
export class NodeResolver {
	constructor(
		@InjectRepository(Node)
		private readonly nodeRepository: MongoRepository<Node>
	) {}

	@Query()
	async nodes(
		@Args('text') text: string,
		@Args('code') code: string
	): Promise<Node[]> {
		if (text || code) {
			const node = await this.nodeRepository.find({
				where: {
					$or: [
						{ name: { $regex: `.*${text}|${text.toLowerCase()}.*` } },
						{
							code: code && {
								$regex: `.*${code}|${code.toLowerCase()}.*`
							}
						}
					]
				},
				cache: true
			})

			if (!node) {
				throw new ForbiddenError('Node not found.')
			}

			return node
		}

		return await this.nodeRepository.find({
			cache: true
		})
	}

	@Mutation()
	async createNode(@Args('input') input: CreateNodeInput): Promise<Node> {
		const { parentId, code, category } = input

		const node = await this.nodeRepository.findOne({ code })

		if (node) {
			throw new ForbiddenError('Node already exists.')
		}

		if (parentId) {
			if (category === NodeCategory.COMPANY && parentId.length >= 0) {
				throw new ForbiddenError('category is COMPANY dont need parentId.')
			}

			const nodeByParentId = await this.nodeRepository.findOne({
				_id: parentId
			})

			if (!nodeByParentId) {
				throw new ForbiddenError('Node not found.')
			}

			const newNode = await this.nodeRepository.save(
				new Node({ ...input, path: nodeByParentId.path })
			)

			return newNode
		}

		const newNode = await this.nodeRepository.save(new Node({ ...input }))

		return newNode
	}
}
