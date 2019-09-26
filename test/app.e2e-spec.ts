import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import config from '../src/config.env'

const { end_point } = config

describe('AppModule (e2e)', () => {
	let app

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	it('QUERY › hello', () => {
		return request(app.getHttpServer())
			.post(`/${end_point}`)
			.send({
				operationName: null,
				variables: {},
				query: '{ hello }'
			})
			.expect(200)
	})

	// afterAll(async () => {
	// 	await app.close()
	// })
})
