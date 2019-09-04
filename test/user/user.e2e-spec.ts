import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../src/models/user.entity'
import { UserResolver } from '../../src/resolvers/user/user.resolver'
import { UserPermission } from '../../src/models/userPermission.entity'
import { History } from '../../src/models/history.entity'
import { UserPermissionResolver } from '../../src/resolvers/userPermission/userPermission.resolver'
import { HistoryResolver } from '../../src/resolvers/history/history.resolver'
import { AppModule } from '../../src/app.module'
import { AuthService } from '../../src/auth/auth.service'
import { MailService } from '../../src/utils/mail/mail.service'

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
				UserPermissionResolver,
				{
					provide: getRepositoryToken(UserPermission),
					useClass: Repository
				},
				HistoryResolver,
				{
					provide: getRepositoryToken(History),
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
			.post('/graphqllunch')
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
