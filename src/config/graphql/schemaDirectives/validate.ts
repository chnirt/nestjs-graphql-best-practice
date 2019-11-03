import { SchemaDirectiveVisitor } from 'graphql-tools'
import {
	defaultFieldResolver,
	GraphQLArgument,
	GraphQLField,
	GraphQLObjectType
} from 'graphql'
import { registerSchema, validate } from 'class-validator'
import { CreateUserInput, UserInput } from '../../../generator/graphql.schema'

class ValidateDirective extends SchemaDirectiveVisitor {
	visitArgumentDefinition(
		arg: GraphQLArgument,
		details: {
			field: GraphQLField<any, any>
			objectType: GraphQLObjectType
		}
	) {
		const { field } = details
		const { resolve = defaultFieldResolver } = field

		const { schema } = this.args

		field.resolve = async function(...args) {
			const { input: string } = args[1]

			const user = {
				firstName: 'Johny',
				lastName: 'Cage',
				email: 'chnirt@gmail.com'
			}

			validate(schema, user).then(errors => {
				if (errors.length > 0) {
					console.log('Validation failed: ', errors)
				} else {
					console.log('Validation succeed.')
				}
			})

			// console.log(schema)
			// console.log(input)
			return await resolve.apply(this, args)
		}
	}
}

export default ValidateDirective
