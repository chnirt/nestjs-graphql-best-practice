import { SchemaDirectiveVisitor, ApolloError } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = function(...args) {
      const { currentUser } = args[2];

      if (!currentUser) {
        throw new ApolloError('currentUser Required', '499', {});
      }

      return resolve.apply(this, args);
    };
  }
}

export default AuthDirective;
