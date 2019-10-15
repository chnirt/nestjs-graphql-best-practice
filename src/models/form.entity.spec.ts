import { Form } from './form.entity'

describe('Form class', () => {
	const form = new Form({})
	it('save should be defined', () => {
		expect(form.save())
	})

	it('save should be defined', () => {
		expect(form.update())
	})
})
