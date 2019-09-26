import { SchemaDirectiveVisitor } from 'graphql-tools';
import { ApolloError } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';
import { getMongoRepository } from 'typeorm';
// import { UserPermission } from '../../../models'

class PermissionDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { permission } = this.args;

    field.resolve = async function(...args) {
      const { currentUser, currentsite } = args[2];

      const result = await resolve.apply(this, args);

      // if (!currentUser || !currentsite) {
      // 	throw new ApolloError('currentUser & currentsite Required', '499', {})
      // }

      // // console.log(currentUser, currentsite, permission)

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

      return resolve.apply(this, args);
    };
  }
}

export default PermissionDirective;
