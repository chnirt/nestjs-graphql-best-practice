/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
import {
	Entity,
	Column,
	ObjectIdColumn,
	BeforeInsert,
	BeforeUpdate,
	BeforeRemove,
	CreateDateColumn,
	UpdateDateColumn,
	Index
} from 'typeorm'
import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'
import {
	IsString,
	IsNotEmpty,
	Length,
	MinLength,
	IsEmail,
	IsBoolean
} from 'class-validator'

export class LoginUserInput {
	@IsString()
	@MinLength(4, {
		message: 'Your username must be at least 4 characters'
	})
	@IsNotEmpty()
	username: string
	@Length(1, 8, {
		message: 'Your password must be between 1 and 8 characters.'
	})
	@IsString()
	@IsNotEmpty()
	password: string
}

export class CreateUserInput {
	@IsString()
	@MinLength(4, {
		message: 'Your username must be at least 4 characters'
	})
	@IsNotEmpty({ message: 'Your username can not be blank.' })
	username: string

	@Length(1, 8, {
		message: 'Your password must be between 1 and 8 characters.'
	})
	@IsString()
	@IsNotEmpty({ message: 'Your password can not be blank.' })
	password: string

	@IsEmail(undefined, { message: 'Invalid email message' })
	@IsNotEmpty({ message: 'Your email can not be blank.' })
	email: string
}

export class LoginResponse {
	@IsString()
	token: string
}

@Entity()
export class User {
	@ObjectIdColumn()
	_id: string

	@Column()
	@IsString()
	@IsNotEmpty()
	username: string

	@Column()
	@IsString()
	@IsNotEmpty()
	password: string

	@Column()
	@IsString()
	@IsNotEmpty()
	@Index({ unique: true })
	email: string

	@Column()
	@IsString()
	@IsNotEmpty()
	role: string

	@Column()
	@IsBoolean()
	@IsNotEmpty()
	status: boolean

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: string

<<<<<<< HEAD:src/modules/user/user.entity.ts
	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: string
=======
  @Column()
  reason: string

  @Column()
  isActive: boolean
>>>>>>> c85fe22... Fix entities and add common services:src/modules/common/entities/user.entity.ts

	@BeforeInsert()
	async b4register() {
		this._id = await uuid.v1()
		this.role = await 'MEMBER'
		this.status = await true
		this.password = await bcrypt.hash(this.password, 10)
	}

	@BeforeUpdate()
	async b4update() {
		this.password = await bcrypt.hash(this.password, 10)
	}

<<<<<<< HEAD:src/modules/user/user.entity.ts
	@BeforeRemove()
	async b4block() {
		this.status = false
	}
=======
  @BeforeInsert()
  async b4create() {
    this._id = await uuidv1()
    this.isLocked = await false
    this.password = await bcrypt.hash(this.password, 10)
  }
>>>>>>> c85fe22... Fix entities and add common services:src/modules/common/entities/user.entity.ts

	async matchesPassword(password) {
		return await bcrypt.compare(password, this.password)
	}
}
