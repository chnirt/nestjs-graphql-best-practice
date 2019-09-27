import { SchemaDirectiveVisitor } from 'graphql-tools'
import { defaultFieldResolver } from 'graphql'

class ConcatDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		const { resolve = defaultFieldResolver } = field
		const { value } = this.args
		field.resolve = async function(...args) {
			const result = await resolve.apply(this, args)
			if (typeof result !== 'undefined') {
				return `${result}${value}`
			}
			return result
		}
	}
}

export default ConcatDirective
