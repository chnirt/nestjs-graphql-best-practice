import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User, Email, File } from '../../src/models'

import { AppModule } from '../../src/app.module'
import { FileModule } from '../../src/resolvers/file/file.module'
import { AuthModule } from '../../src/auth/auth.module'
import { MailModule } from '../../src/shared/mail/mail.module'
import { EmailModule } from '../../src/resolvers/email/email.module'

import { AuthService } from '../../src/auth/auth.service'
import { MailService } from '../../src/shared/mail/mail.service'
import { UploadService } from '../../src/shared/upload/upload.service'

import { UserResolver } from '../../src/resolvers/user/user.resolver'
import { EmailResolver } from '../../src/resolvers/email/email.resolver'
import { FileResolver } from '../../src/resolvers/file/file.resolver'

import { END_POINT } from '../../src/environments'

describe('UserModule (e2e)', () => {
	let app: INestApplication
	let userResolver

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule, AuthModule, MailModule, EmailModule, FileModule],
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
				},
				FileResolver,
				{
					provide: getRepositoryToken(File),
					useClass: Repository
				},
				UploadService
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
