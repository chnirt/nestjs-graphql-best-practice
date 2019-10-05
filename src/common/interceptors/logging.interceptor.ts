import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			tap(() => {
				Logger.debug(
					`⛩  ${context.getArgs()[3]['parentType']} » ${context.getArgs()[3]['fieldName']}`,
					'GraphQL'
				)
			})
		)
	}
}
