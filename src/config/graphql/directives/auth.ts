import {
	SchemaDirectiveVisitor,
	ApolloError,
	AuthenticationError
} from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'

class AuthDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		const { resolve = defaultFieldResolver } = field

		field.resolve = function(...args) {
			const { currentUser } = args[2]

			if (!currentUser) {
				throw new AuthenticationError('you must be logged in')
			}

			return resolve.apply(this, args)
		}
	}
}

export default AuthDirective
