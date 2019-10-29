import { SchemaDirectiveVisitor } from 'apollo-server-express'
import { GraphQLScalarType, GraphQLNonNull } from 'graphql'
import assert from 'chai'

class LimitedLengthType extends GraphQLScalarType {
	constructor(type, maxLength) {
		super({
			name: `LengthAtMost${maxLength}`,

			// For more information about GraphQLScalar type (de)serialization,
			// see the graphql-js implementation:
			// https://github.com/graphql/graphql-js/blob/31ae8a8e8312/src/type/definition.js#L425-L446

			serialize(value) {
				value = type.serialize(value)
				assert.isAtMost(value.length, maxLength)
				return value
			},

			parseValue(value) {
				return type.parseValue(value)
			},

			parseLiteral(ast) {
				return type.parseLiteral(ast)
			}
		})
	}
}

class LengthDirective extends SchemaDirectiveVisitor {
	visitInputFieldDefinition(field) {
		this.wrapType(field)
	}

	visitFieldDefinition(field) {
		this.wrapType(field)
	}

	// Replace field.type with a custom GraphQLScalarType that enforces the
	// length restriction.
	wrapType(field) {
		console.log(this.args.max)
		if (
			field.type instanceof GraphQLNonNull &&
			field.type.ofType instanceof GraphQLScalarType
		) {
			console.log(this.args.max)
			field.type = new GraphQLNonNull(
				new LimitedLengthType(field.type.ofType, this.args.max)
			)
		} else if (field.type instanceof GraphQLScalarType) {
			console.log(this.args.max)
			field.type = new LimitedLengthType(field.type, this.args.max)
		} else {
			console.log(this.args.max)
			throw new Error(`Not a scalar type: ${field.type}`)
		}
	}
}

export default LengthDirective
