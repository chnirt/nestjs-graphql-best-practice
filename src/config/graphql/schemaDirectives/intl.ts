import { SchemaDirectiveVisitor } from 'graphql-tools'
import { defaultFieldResolver } from 'graphql'

import { translate } from '../../../shared'

class IntlDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field, details) {
		const { resolve = defaultFieldResolver } = field
		field.resolve = async function(...args) {
			const context = args[2]
			const defaultText = await resolve.apply(this, args)
			// In this example, path would be ["Query", "greeting"]:
			const path = [details.objectType.name, field.name]
			// return translate(defaultText, path, context.locale)
			console.log(context, defaultText, path)
			return defaultText
		}
	}
}

export default IntlDirective
