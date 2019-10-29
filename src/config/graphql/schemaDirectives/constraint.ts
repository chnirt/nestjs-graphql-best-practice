import {
	DirectiveLocation,
	GraphQLDirective,
	GraphQLInt,
	GraphQLFloat,
	GraphQLNonNull,
	GraphQLString
} from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'
// import ConstraintStringType from '../scalars/string'
// import ConstraintNumberType from '../scalars/number'

class ConstraintDirective extends SchemaDirectiveVisitor {
	static getDirectiveDeclaration(directiveName, schema) {
		return new GraphQLDirective({
			name: directiveName,
			locations: [
				DirectiveLocation.FIELD_DEFINITION,
				DirectiveLocation.INPUT_FIELD_DEFINITION
			],
			args: {
				/* Strings */
				minLength: { type: GraphQLInt },
				maxLength: { type: GraphQLInt },
				startsWith: { type: GraphQLString },
				endsWith: { type: GraphQLString },
				contains: { type: GraphQLString },
				notContains: { type: GraphQLString },
				pattern: { type: GraphQLString },
				format: { type: GraphQLString },

				/* Numbers (Int/Float) */
				min: { type: GraphQLFloat },
				max: { type: GraphQLFloat },
				exclusiveMin: { type: GraphQLFloat },
				exclusiveMax: { type: GraphQLFloat },
				multipleOf: { type: GraphQLFloat }
			}
		})
	}

	visitInputFieldDefinition(field) {
		this.wrapType(field)
	}

	visitFieldDefinition(field) {
		this.wrapType(field)
	}

	wrapType(field) {
		const fieldName = field.astNode.name.value
		console.log('aaaaaa')
		if (
			field.type instanceof GraphQLNonNull &&
			field.type.ofType === GraphQLString
		) {
			// field.type = new GraphQLNonNull(
			// 	new ConstraintStringType(fieldName, field.type.ofType, this.args)
			// )
		} else if (field.type === GraphQLString) {
			// field.type = new ConstraintStringType(fieldName, field.type, this.args)
		} else if (
			field.type instanceof GraphQLNonNull &&
			(field.type.ofType === GraphQLFloat || field.type.ofType === GraphQLInt)
		) {
			// field.type = new GraphQLNonNull(
			// 	new ConstraintNumberType(fieldName, field.type.ofType, this.args)
			// )
		} else if (field.type === GraphQLFloat || field.type === GraphQLInt) {
			// field.type = new ConstraintNumberType(fieldName, field.type, this.args)
		} else {
			throw new Error(`Not a scalar type: ${field.type}`)
		}
	}
}

module.exports = ConstraintDirective
