import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { uuidv4 } from '@utils'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
	name: 'files',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class File {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	filename: string

	@Expose()
	@Column()
	path: string

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number

	constructor(file: Partial<File>) {
		if (file) {
			Object.assign(
				this,
				plainToClass(File, file, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuidv4()
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
