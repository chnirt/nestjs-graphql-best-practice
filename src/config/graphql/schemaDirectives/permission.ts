import { SchemaDirectiveVisitor } from 'graphql-tools'
import { ForbiddenError } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'

class PermissionDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		const { resolve = defaultFieldResolver } = field
		const { permission } = this.args

		field.resolve = async function(...args) {
			const { currentUser } = args[2]

			if (!currentUser) {
				throw new ForbiddenError('You are not authorized for this resource.')
			}

			console.log(currentUser, permission)

			// const userpermission = await getMongoRepository(UserPermission).findOne({
			// 	userId: currentUser._id,
			// 	siteId: currentsite
			// })

			// // console.log(userpermission)

			// const { permissions } = userpermission

			// const index = permissions.map(item => item.code).indexOf(permission)

			// if (index === -1) {
			// 	throw new ApolloError('Unauthorized', '401', {})
			// }

			return resolve.apply(this, args)
		}
	}
}

export default PermissionDirective
