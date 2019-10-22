import {
	Entity,
	ObjectIdColumn,
	Column,
	BeforeInsert,
	BeforeUpdate
} from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import * as uuid from 'uuid'

@Entity({
	name: 'files',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class File {
	@ObjectIdColumn()
	_id: string

	@Column()
	filename: string

	@Column()
	path: string

	@Column()
	createdAt: number
	@Column()
	updatedAt: number

	constructor(file: Partial<File>) {
		Object.assign(this, file)
	}

	@BeforeInsert()
	save() {
		this._id = uuid.v1()
		this.createdAt = +new Date()
		this.updatedAt = +new Date()
	}

	@BeforeUpdate()
	update() {
		this.updatedAt = +new Date()
	}
}
