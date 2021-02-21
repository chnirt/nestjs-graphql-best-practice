import { SchemaDirectiveVisitor } from 'graphql-tools'
import {
	defaultFieldResolver,
	GraphQLArgument,
	GraphQLField,
	GraphQLObjectType
} from 'graphql'
import { registerSchema, validate } from 'class-validator'
import { UserInputError } from 'apollo-server-core'
import { Logger } from '@nestjs/common'
import * as chalk from 'chalk'

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

			let UserValidationSchema = {
				// using interface here is not required, its just for type-safety
				name: 'myUserSchema', // this is required, and must be unique
				properties: {
					firstName: [
						{
							type: 'minLength', // validation type. All validation types are listed in ValidationTypes class.
							constraints: [2]
						},
						{
							type: 'maxLength',
							constraints: [3]
						}
					]
				}
			}
			registerSchema(UserValidationSchema)
			const user = { firstName: 'Johny' }
			validate('myUserSchema', user).then(errors => {
				if (errors.length > 0) {
					console.log('Validation failed: ', errors)
				} else {
					console.log('Validation succeed.')
				}
			})

			Logger.log(
				`🧪  Schema: ${chalk.hex(PRIMARY_COLOR).bold(`${schema}`)}`,
				'Validator',
				false
			)

			// console.log('-->', arg, details, input, schema)

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
