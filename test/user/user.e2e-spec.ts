import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserModule } from '../../src/modules/user/user.module'
import { User } from '../../src/modules/user/user.entity'
import { UserResolver } from '../../src/modules/user/user.resolver'
import { UserPermission } from '../../src/modules/userPermission/userPermission.entity'
import { History } from '../../src/modules/history/history.entity'
import { UserPermissionResolver } from '../../src/modules/userPermission/userPermission.resolver'
import { HistoryResolver } from '../../src/modules/history/history.resolver'
import { AppModule } from '../../src/app.module'

describe('UserModule (e2e)', () => {
	let app: INestApplication
	let resolver: UserResolver

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			providers: [
				UserResolver,
				{
					provide: getRepositoryToken(User),
					useClass: Repository
				},
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

		resolver = module.get<UserResolver>(UserResolver)

		app = module.createNestApplication()
		await app.init()
	})

	it('QUERY › users', () => {
		return request(app.getHttpServer())
			.post('/graphqllunch')
			.send({
				operationName: null,
				variables: {},
				query: '{ users { _id username createdAt updatedAt } }'
			})
			.expect(200)
	})

	afterAll(async () => {
		await app.close()
	})
})
