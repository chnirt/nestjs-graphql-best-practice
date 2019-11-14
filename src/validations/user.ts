import { ValidationSchema, registerSchema } from 'class-validator'

const firstName = [
	{
		type: 'minLength', // validation type. All validation types are listed in ValidationTypes class.
		constraints: [3],
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
		constraints: [3],
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
		message: 'Your password must be between 1 and 8 characters.'
	},
	{
		type: 'maxLength',
		constraints: [8],
		message: 'Your password must be between 1 and 8 characters.'
	}
]

const createUserValidation: ValidationSchema = {
	// using interface here is not required, its just for type-safety
	name: 'createUserRegister', // this is required, and must be unique
	properties: {
		firstName,
		lastName,
		email,
		password
	}
}

const updateUserValidation: ValidationSchema = {
	// using interface here is not required, its just for type-safety
	name: 'updateUserRegister', // this is required, and must be unique
	properties: {
		firstName,
		lastName,
		password
	}
}

export const loginUserValidation: ValidationSchema = {
	name: 'loginUserRegister',
	properties: {
		email,
		password
	}
}

registerSchema(createUserValidation)
registerSchema(updateUserValidation)
registerSchema(loginUserValidation)
