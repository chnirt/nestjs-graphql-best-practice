import { Site } from './site.entity'

describe('Site class', () => {
	const site = new Site()
	it('save should be defined', () => {
		expect(site.save())
	})
})
