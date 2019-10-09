import { SchemaDirectiveVisitor } from 'graphql-tools'
import { GraphQLScalarType, GraphQLNonNull } from 'graphql'
import assert from 'chai'
import { defaultFieldResolver } from 'graphql'

class LengthDirective extends SchemaDirectiveVisitor {
	visitInputFieldDefinition(field) {
		this.wrapType(field)
	}

	visitFieldDefinition(field) {
		this.wrapType(field)
	}

	visitObject(field) {
		this.wrapType(field)
	}

	// // Replace field.type with a custom GraphQLScalarType that enforces the
	// // length restriction.
	wrapType(field) {
		if (
			field.type instanceof GraphQLNonNull &&
			field.type.ofType instanceof GraphQLScalarType
		) {
			// field.type = new GraphQLNonNull(
			// 	new LimitedLengthType(field.type.ofType, this.args.max)
			// )
			throw new Error('1')
		} else if (field.type instanceof GraphQLScalarType) {
			// field.type = new LimitedLengthType(field.type, this.args.max)
			throw new Error('2')
		} else {
			throw new Error(`Not a scalar type: ${field.type}`)
		}
	}
	// public visitObject(field) {
	// 	const { resolve = defaultFieldResolver } = field
	// 	// const { defaultFormat } = this.args
	// 	console.log('input1', this.args)
	// 	field.resolve = async function(...args) {
	// 		const result = await resolve.apply(this, args)
	// 		console.log('input2', result)
	// 		return result
	// 	}
	// }

	// public visitFieldDefinition(field) {
	// 	const { resolve = defaultFieldResolver } = field
	// 	// const { defaultFormat } = this.args
	// 	console.log('field1', this.args)
	// 	field.resolve = async function(...args) {
	// 		const result = await resolve.apply(this, args)
	// 		console.log('field2', result)
	// 		return result
	// 	}
	// }

	// public visitInputFieldDefinition(field) {
	// 	const { resolve = defaultFieldResolver } = field
	// 	// const { defaultFormat } = this.args
	// 	console.log('object1', this.args)
	// 	field.resolve = async function(...args) {
	// 		const result = await resolve.apply(this, args)
	// 		console.log('object2', result)
	// 		return result
	// 	}
	// }
}

// class LimitedLengthType extends GraphQLScalarType {
// 	constructor(type, maxLength) {
// 		super({
// 			name: `LengthAtMost${maxLength}`,

// 			// For more information about GraphQLScalar type (de)serialization,
// 			// see the graphql-js implementation:
// 			// https://github.com/graphql/graphql-js/blob/31ae8a8e8312/src/type/definition.js#L425-L446

// 			serialize(value) {
// 				value = type.serialize(value)
// 				assert.isAtMost(value.length, maxLength)
// 				return value
// 			},

// 			parseValue(value) {
// 				return type.parseValue(value)
// 			},

// 			parseLiteral(ast) {
// 				return type.parseLiteral(ast)
// 			}
// 		})
// 	}
// }

export default LengthDirective
