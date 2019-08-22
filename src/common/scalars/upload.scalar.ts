import { Scalar, CustomScalar } from '@nestjs/graphql'
import { GraphQLUpload } from 'graphql-upload'

@Scalar('Upload')
export class Upload implements CustomScalar<object, string> {
	description = 'Upload custom scalar type'

	parseValue(value) {
		// value.name = 'Screenshot from 2019-08-13 08-26-46.png'
		// value.size = 1603258
		// value.type = 'image/png'
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
