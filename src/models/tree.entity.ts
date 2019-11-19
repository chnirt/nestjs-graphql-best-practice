import { Entity, ObjectIdColumn, Column } from 'typeorm'
import * as uuid from 'uuid'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
	name: 'trees',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Tree {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	treeData: string

	constructor(tree: Partial<Tree>) {
		if (tree) {
			Object.assign(
				this,
				plainToClass(Tree, tree, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuid.v1()
		}
	}
}
