import { createRateLimitDirective } from 'graphql-rate-limit'
import AuthDirective from './auth'
import PermissionDirective from './permission'
import PathDirective from './path'
import DeprecatedDirective from './deprecated'
// import LengthDirective from './length'
import DateFormatDirective from './date'
import UpperCaseDirective from './upper'
import ConcatDirective from './concat'
import RestDirective from './rest'
import IntlDirective from './intl'
import ValidateDirective from './validate'

export default {
	isAuthenticated: AuthDirective,
	hasPermission: PermissionDirective,
	hasPath: PathDirective,
	deprecated: DeprecatedDirective,
	// length: LengthDirective,
	rateLimit: createRateLimitDirective({
		identifyContext: ctx => (ctx.currentUser ? ctx.currentUser._id : '')
	}),
	date: DateFormatDirective,
	upper: UpperCaseDirective,
	concat: ConcatDirective,
	intl: IntlDirective,
	rest: RestDirective,
	validate: ValidateDirective
}
