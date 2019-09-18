import { Dashboard } from './dashboard.entity'

describe('Dashboard class', () => {
	const dashboard = new Dashboard()
	it('save should be defined', () => {
		expect(dashboard.save())
	})
})
