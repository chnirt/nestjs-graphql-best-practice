import { ValidationSchema, registerSchema, validate } from 'class-validator'

const firstName = [
	{
		type: 'minLength', // validation type. All validation types are listed in ValidationTypes class.
		constraints: [2],
		message: 'Your firstName must be between 3 and 20 characters'
	},
	{
		type: 'maxLength',
		constraints: [20],
		message: 'Your firstName must be between 3 and 20 characters'
	}
]

const lastName = [
	{
		type: 'minLength', // validation type. All validation types are listed in ValidationTypes class.
		constraints: [2],
		message: 'Your lastName must be between 3 and 20 characters.'
	},
	{
		type: 'maxLength',
		constraints: [20],
		message: 'Your lastName must be between 3 and 20 characters.'
	}
]

const email = [
	{
		type: 'isEmail',
		constraints: [{}],
		message: 'Your email is invalid.'
	}
]

const password = [
	{
		type: 'minLength', // validation type. All validation types are listed in ValidationTypes class.
		constraints: [1],
		message: 'Your password must be between 3 and 20 characters.'
	},
	{
		type: 'maxLength',
		constraints: [8],
		message: 'Your password must be between 3 and 20 characters.'
	}
]

// const gender = [
// 	{
// 		type: 'isNotEmpty',
// 		// options: { required: {} },
// 		message: 'Your gender can not be blank'
// 	}
// ]

const createUserSchema: ValidationSchema = {
	// using interface here is not required, its just for type-safety
	name: 'createUserSchema', // this is required, and must be unique
	properties: {
		firstName,
		lastName,
		email,
		password
	}
}

export const createUserRegister = registerSchema(createUserSchema)

// const user = {
// 	firstName: 'Johny',
// 	lastName: 'Cage',
// 	email: 'chnirt@gmail.com'
// }

// validate('myUserSchema', user).then(errors => {
// 	if (errors.length > 0) {
// 		console.log('Validation failed: ', errors)
// 	} else {
// 		console.log('Validation succeed.')
// 	}
// })
