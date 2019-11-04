import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { UserInputError } from 'apollo-server-core'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
	async transform(value: any, { metatype }: ArgumentMetadata) {
		// destructuring metadata
		if (!metatype || !this.toValidate(metatype)) {
			return value
		}
		const object = plainToClass(metatype, value)
		const errors = await validate(object)
		if (errors.length > 0) {
			throw new UserInputError(
				`Form Arguments invalid: ${this.formatErrors(errors)}`
			)
		}
		return value
	}

	// tslint:disable-next-line:ban-types
	private toValidate(metatype: Function): boolean {
		// tslint:disable-next-line:ban-types
		const types: Function[] = [String, Boolean, Number, Array, Object]
		return !types.includes(metatype)
	}

	private formatErrors(errors: any[]) {
		return errors
			.map(err => {
				// tslint:disable-next-line: forin
				for (const property in err.constraints) {
					return err.constraints[property]
				}
			})
			.join(', ')
	}
}
