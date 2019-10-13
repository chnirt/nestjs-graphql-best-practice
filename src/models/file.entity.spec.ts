import { File } from './file.entity'

describe('File class', () => {
	const file = new File({})
	it('save should be defined', () => {
		expect(file.save())
	})

	it('save should be defined', () => {
		expect(file.update())
	})
})
