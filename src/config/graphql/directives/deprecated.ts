import { SchemaDirectiveVisitor } from 'graphql-tools';
import { GraphQLField, GraphQLEnumValue } from 'graphql';

class DeprecatedDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    field.isDeprecated = true;
    field.deprecationReason = this.args.reason;
  }

  public visitEnumValue(value: GraphQLEnumValue) {
    value.isDeprecated = true;
    value.deprecationReason = this.args.reason;
  }
}

export default DeprecatedDirective;
