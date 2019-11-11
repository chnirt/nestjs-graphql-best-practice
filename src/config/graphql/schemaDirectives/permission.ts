import { SchemaDirectiveVisitor } from 'graphql-tools'
import { ForbiddenError, AuthenticationError } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'
import { getMongoRepository } from 'typeorm'
import { Role } from '@models'

class PermissionDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		const { resolve = defaultFieldResolver } = field
		const { permission } = this.args

		field.resolve = async function(...args) {
			const { currentUser } = args[2]

			if (!currentUser) {
				throw new AuthenticationError(
					'Authentication token is invalid, please try again.',
				)
			}

			// console.log(currentUser._id, permission)

			const role = await getMongoRepository(Role).find({
				where: {
					userId: currentUser._id,
					'permissions.code': permission,
				},
			})

			if (!role) {
				throw new ForbiddenError('You are not authorized for this resource.')
			}

			// console.log('Role', role)

			return resolve.apply(this, args)
		}
	}
}

export default PermissionDirective
