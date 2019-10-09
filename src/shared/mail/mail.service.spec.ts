import { Test, TestingModule } from '@nestjs/testing'
import { MailService } from './mail.service'

describe('UploadService', () => {
	let service: MailService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MailService]
		}).compile()

		service = module.get<MailService>(MailService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
