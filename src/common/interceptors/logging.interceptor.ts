import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import chalk from 'chalk'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// console.log('Before...');

		const now = Date.now()
		return next.handle().pipe(
			tap(() => {
				console.log(
					`🎟️ `,
					chalk.hex('#eb2f96').bold(context.getArgs()[3].parentType),
					'»',
					context.getArgs()[3].fieldName,
					chalk.hex('#fff566')(`+${Date.now() - now}ms`)
					// context.getArgs()[2].req.headers &&
					// 	context.getArgs()[2].req.headers['user-agent'].split(') ')[0] + ')'
				)
			})
		)
	}
}
