import { SchemaDirectiveVisitor } from 'graphql-tools'
import { ForbiddenError, AuthenticationError } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'
import { getMongoRepository } from 'typeorm'
import { UserRole } from '@models'

class PermissionDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		const { resolve = defaultFieldResolver } = field
		const { permission } = this.args

		field.resolve = async function(...args) {
			const { currentUser } = args[2]

			if (!currentUser) {
				throw new AuthenticationError(
					'Authentication token is invalid, please try again.'
				)
			}

			// console.log(currentUser._id, permission)

			const userRoles = await getMongoRepository(UserRole)
				.aggregate([
					{
						$match: {
							userId: currentUser._id
						}
					},
					{
						$lookup: {
							from: 'roles',
							localField: 'roleId',
							foreignField: '_id',
							as: 'roles'
						}
					},
					{
						$lookup: {
							from: 'permissions',
							localField: 'roles.permissions',
							foreignField: '_id',
							as: 'permissions'
						}
					},
					{
						$project: {
							permissions: {
								$map: {
									input: '$permissions.code',
									as: 'code',
									in: '$$code'
								}
							},
							_id: 0
						}
					}
				])
				.toArray()

			console.log(userRoles[0].permissions)

			if (userRoles[0].permissions.indexOf(permission) === -1) {
				throw new ForbiddenError('You are not authorized for this resource.')
			}

			// console.log('userRole', userRole)

			return resolve.apply(this, args)
		}
	}
}

export default PermissionDirective
