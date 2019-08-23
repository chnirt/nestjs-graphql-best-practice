import { Scalar, CustomScalar } from '@nestjs/graphql'
import { GraphQLUpload } from 'graphql-upload'

@Scalar('Upload')
export class Upload {
	description = 'Upload custom scalar type'

	parseValue(value) {
		// console.log(value)
		return GraphQLUpload.parseValue(value)
	}

	serialize(value: any) {
		// console.log('a')
		return GraphQLUpload.serialize(value)
	}

	parseLiteral(ast) {
		// console.log('a')
		// console.log(ast.length)
		return GraphQLUpload.parseLiteral(ast, ast.value)
	}
}
