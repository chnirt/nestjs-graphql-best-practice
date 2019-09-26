import { createRateLimitDirective } from 'graphql-rate-limit';
import AuthDirective from './auth';
import PermissionDirective from './permission';
import DeprecatedDirective from './deprecated';
import LengthDirective from './length';
import DateFormatDirective from './date';
import UpperCaseDirective from './upper';
import ConcatDirective from './concat';
import RestDirective from './rest';

export default {
  isAuthenticated: AuthDirective,
  hasPermission: PermissionDirective,
  deprecated: DeprecatedDirective,
  length: LengthDirective,
  rateLimit: createRateLimitDirective({ identifyContext: ctx => ctx.id }),
  date: DateFormatDirective,
  upper: UpperCaseDirective,
  concat: ConcatDirective,
  rest: RestDirective,
};
