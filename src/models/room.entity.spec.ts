import { Room } from './room.entity'

describe('Room class', () => {
	const room = new Room({})
	it('save should be defined', () => {
		expect(room.save())
	})

	it('save should be defined', () => {
		expect(room.update())
	})
})
