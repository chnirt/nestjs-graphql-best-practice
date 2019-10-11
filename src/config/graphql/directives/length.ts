import { SchemaDirectiveVisitor } from 'graphql-tools'
import {
	GraphQLScalarType,
	GraphQLNonNull,
	defaultFieldResolver
} from 'graphql'
import assert from 'chai'

class LengthDirective extends SchemaDirectiveVisitor {
	visitInputFieldDefinition(field) {
		const { resolve = defaultFieldResolver } = field
		console.log(this.args)

		field.resolve = function(...args) {
			const { currentUser } = args[2]
			console.log('hello')

			// if (!currentUser) {
			// 	throw new ForbiddenError('You are not authorized for this resource.')
			// }

			return resolve.apply(this, args)
		}
	}

	visitFieldDefinition(field) {
		const { resolve = defaultFieldResolver } = field
		console.log(this.args)

		field.resolve = function(...args) {
			const { currentUser } = args[2]
			console.log('1hello')

			// if (!currentUser) {
			// 	throw new ForbiddenError('You are not authorized for this resource.')
			// }

			return resolve.apply(this, args)
		}
	}
}

export default LengthDirective
