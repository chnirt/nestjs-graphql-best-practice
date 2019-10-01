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
				throw new Error('You are not authenticated!')
			}

			// if (!currentUser.is_admin) {
			// 	throw new Error('This is above your pay grade!')
			// }

			return resolve.apply(this, args)
		}
	}
}

export default AuthDirective
