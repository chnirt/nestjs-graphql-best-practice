import { Order } from './order.entity'

describe('Order class', () => {
	const order = new Order()
	it('save should be defined', () => {
		expect(order.save())
	})
})
