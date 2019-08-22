import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { HistoryModule } from '../../src/modules/history/history.module'
import { History } from '../../src/modules/history/history.entity'
import { HistoryResolver } from '../../src/modules/history/history.resolver'
import { AppModule } from '../../src/app.module'

describe('HistoryModule (e2e)', () => {
	let app
	let resolver: HistoryResolver

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

		resolver = module.get<HistoryResolver>(HistoryResolver)

		app = module.createNestApplication()
		await app.init()
	})

	it('QUERY › histories', async () => {
		const result = await resolver.histories(1565938095476, 1565938499525)
		return request(app.getHttpServer())
			.post('/graphqllunch')
			.send({
				operationName: null,
				variables: {
					start: 1565938095476,
					end: 1565938499525
				},
				query:
					'query($start: Float!, $end: Float!) { histories(start: $start , end: $end ){ _id userId description createdAt updatedAt } }'
			})
			.expect(200)
		// .expect({
		// 	data: {
		// 		histories: JSON.parse(JSON.stringify(result))
		// 		// histories: result
		// 	}
		// })
	})

	afterAll(async () => {
		await app.close()
	})
})
