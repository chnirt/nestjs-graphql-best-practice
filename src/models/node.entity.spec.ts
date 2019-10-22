import { Node } from './node.entity'

describe('Node class', () => {
	const node = new Node({})
	it('save should be defined', () => {
		expect(node.save())
	})

	it('save should be defined', () => {
		expect(node.update())
	})
})
