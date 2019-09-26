import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import config from '../../src/config.env'
import { User } from '../../src/models'
import { UserResolver } from '../../src/resolvers/user/user.resolver'
import { AppModule } from '../../src/app.module'
import { AuthService } from '../../src/auth/auth.service'
import { MailService } from '../../src/utils/mail/mail.service'

const { end_point } = config

describe('UserModule (e2e)', () => {
	let app: INestApplication
	let userResolver: UserResolver

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			providers: [
				UserResolver,
				{
					provide: getRepositoryToken(User),
					useClass: Repository
				},
				AuthService,
				MailService
			]
		}).compile()

		userResolver = module.get<UserResolver>(UserResolver)

		app = module.createNestApplication()
		await app.init()
	})

	it('QUERY › users', () => {
		return request(app.getHttpServer())
			.post(`/${end_point}`)
			.send({
				operationName: null,
				variables: {},
				query:
					// tslint:disable-next-line:max-line-length
					'{ users { _id firstName lastName email password resetPasswordToken resetPasswordExpires fullName isLocked reason isActive createdAt updatedAt } }'
			})
			.expect(200)
	})

	// afterAll(async () => {
	// 	await app.close()
	// })
})
