import { SchemaDirectiveVisitor } from 'graphql-tools'
import { defaultFieldResolver } from 'graphql'

class UpperCaseDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		const { resolve = defaultFieldResolver } = field
		field.resolve = async function(...args) {
			const result = await resolve.apply(this, args)
			if (typeof result === 'string') {
				return result.toUpperCase()
			}
			return result
		}
	}
}

export default UpperCaseDirective
