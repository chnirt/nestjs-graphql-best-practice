import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { HistoryModule } from '../../src/resolvers/history/history.module'
import { History } from '../../src/models/history.entity'
import { HistoryResolver } from '../../src/resolvers/history/history.resolver'
import { AppModule } from '../../src/app.module'

describe('HistoryModule (e2e)', () => {
	let app
	let historyResolver: HistoryResolver

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			// imports: [HistoryModule],
			providers: [
				HistoryResolver,
				{
					provide: getRepositoryToken(History),
					useClass: Repository
				}
			]
		}).compile()

		historyResolver = module.get<HistoryResolver>(HistoryResolver)

		app = module.createNestApplication()
		await app.init()
	})

	it('QUERY › histories', async () => {
		let result: any = await historyResolver.histories(
			1567057084695,
			1567057084695
		)

		result = await result.map(item => ({
			_id: item._id,
			userId: item.userId,
			description: item.description,
			createdAt: new Date(item.createdAt).getTime().toString(),
			updatedAt: new Date(item.updatedAt).getTime().toString()
		}))

		request(app.getHttpServer())
			.post('/graphqllunch')
			.send({
				operationName: null,
				variables: {
					start: 1567057084695,
					end: 1567057084695
				},
				query:
					'query($start: Float!, $end: Float!) { histories(start: $start , end: $end ){ _id userId description createdAt updatedAt } }'
			})
			.expect(200)
			.expect({
				data: {
					histories: result
				}
			})
	})

	afterAll(async () => {
		await app.close()
	})
})
