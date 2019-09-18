import { History } from './history.entity'

describe('History class', () => {
	const history = new History()
	it('save should be defined', () => {
		expect(history.save())
	})
})
