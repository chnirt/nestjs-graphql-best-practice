import { SchemaDirectiveVisitor } from 'graphql-tools'
import {
	defaultFieldResolver,
	GraphQLArgument,
	GraphQLField,
	GraphQLObjectType
} from 'graphql'
import { validate } from 'class-validator'
import { UserInputError } from 'apollo-server-core'
import { Logger } from '@nestjs/common'
import chalk from 'chalk'

import * as GraphqlSchema from '../../../generator/graphql.schema'

import { PRIMARY_COLOR } from '@environments'

class ValidateDirective extends SchemaDirectiveVisitor {
	visitArgumentDefinition(
		arg: GraphQLArgument,
		details: {
			field: GraphQLField<any, any>
			objectType: GraphQLObjectType
		}
	) {
		const { field } = details
		const { resolve = defaultFieldResolver } = field

		const { schema } = this.args

		field.resolve = async function(...args) {
			const { input } = args[1]

			Logger.log(
				`🧪  Schema: ${chalk.hex(PRIMARY_COLOR!).bold(`${schema!}`)}`,
				'Validator',
				false
			)

			// console.log(arg, details, input, schema)

			const prototype = arg.type.toString().replace('!', '')

			const object = new GraphqlSchema[prototype]()

			Object.assign(object, input)

			const errors = await validate(schema, object)

			if (errors.length > 0) {
				throw new UserInputError(
					`Form Arguments invalid: ${errors
						.map(err => {
							// tslint:disable-next-line: forin
							for (const property in err.constraints) {
								return err.constraints[property]
							}
						})
						.join(', ')}`
				)
			}

			return await resolve.apply(this, args)
		}
	}
}

export default ValidateDirective
