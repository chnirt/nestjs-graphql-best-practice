import { GraphQLDefinitionsFactory } from '@nestjs/graphql'
import { join } from 'path'

const definitionsFactory = new GraphQLDefinitionsFactory()
definitionsFactory.generate({
	typePaths: ['./src/**/*.graphql'],
	path: join(process.cwd(), 'src/generator/graphql.schema.ts'),
	outputAs: 'class',
	debug: true
})
