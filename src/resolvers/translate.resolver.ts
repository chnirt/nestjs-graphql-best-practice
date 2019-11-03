import { Resolver, Mutation, Args } from '@nestjs/graphql'

import { translate } from '@shared'

@Resolver('Translate')
export class TranslateResolver {
	@Mutation()
	async translate(
		@Args('text') text: string,
		@Args('code') code: string
	): Promise<string> {
		return await translate(text, code)
	}
}
