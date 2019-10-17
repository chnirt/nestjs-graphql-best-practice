import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, Email } from '../../src/models'
import { UserResolver } from '../../src/resolvers/user/user.resolver'
import { AppModule } from '../../src/app.module'
import { AuthService } from '../../src/auth/auth.service'
import { MailService } from '../../src/shared/mail/mail.service'
import { EmailResolver } from '../../src/resolvers/email/email.resolver'

import { END_POINT } from '../../src/environments'

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
				MailService,
				EmailResolver,
				{
					provide: getRepositoryToken(Email),
					useClass: Repository
				}
			]
		}).compile()

		userResolver = module.get<UserResolver>(UserResolver)

		app = module.createNestApplication()
		await app.init()
	})

	it('QUERY › users', () => {
		return request(app.getHttpServer())
			.post(`/${END_POINT}`)
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
