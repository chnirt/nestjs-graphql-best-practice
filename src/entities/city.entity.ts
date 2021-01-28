import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { uuidv4 } from '@utils'
import { Expose, plainToClass } from 'class-transformer'

@Entity({
	name: 'cities',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class City {
	@Expose()
	@ObjectIdColumn()
	_id: string

	@Expose()
	@Column()
	name: string

	@Expose()
	@Column()
	isActive: boolean

	@Expose()
	@Column()
	createdAt: number
	@Expose()
	@Column()
	updatedAt: number

	constructor(city: Partial<City>) {
		if (city) {
			Object.assign(
				this,
				plainToClass(City, city, {
					excludeExtraneousValues: true
				})
			)
			this._id = this._id || uuidv4()
			this.isActive = this.isActive !== undefined ? this.isActive : true
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}
	}
}
