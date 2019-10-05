import { SchemaDirectiveVisitor, ForbiddenError } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'

class AuthDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		const { resolve = defaultFieldResolver } = field

		field.resolve = function(...args) {
			const { currentUser } = args[2]

			if (!currentUser) {
				throw new ForbiddenError('You are not authorized for this ressource.')
			}

			return resolve.apply(this, args)
		}
	}
}

export default AuthDirective
