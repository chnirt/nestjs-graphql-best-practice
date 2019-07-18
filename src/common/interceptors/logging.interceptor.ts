import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// console.log('Before...');

		const now = Date.now()
		return next
			.handle()
			.pipe(
				tap(() =>
					console.log(
						context.getArgs()[3].parentType,
						'➢ ',
						context.getArgs()[3].fieldName,
						`is finished in ${Date.now() - now}ms`
					)
				)
			)
	}
}
