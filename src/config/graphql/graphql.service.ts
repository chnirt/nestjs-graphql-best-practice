import { Injectable, Inject, Logger } from '@nestjs/common'
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql'
import { MemcachedCache } from 'apollo-server-cache-memcached'
import { PubSub } from 'graphql-subscriptions'
// import { join } from 'path'
import {
	ApolloError,
	GraphQLExtension,
	AuthenticationError
} from 'apollo-server-core'
import { MockList } from 'graphql-tools'
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'
import schemaDirectives from './directives'
import { AuthService } from '../../auth/auth.service'

import {
	NODE_ENV,
	END_POINT,
	FE_URL,
	ACCESS_TOKEN,
	REFRESH_TOKEN
} from '../../environments'

const pubSub = new PubSub()
class MyErrorTrackingExtension extends GraphQLExtension {
	willSendResponse(o) {
		const { context, graphqlResponse } = o

		context.trackErrors(graphqlResponse.errors)

		return o
	}
	// Other lifecycle methods include
	// requestDidStart
	// parsingDidStart
	// validationDidStart
	// executionDidStart
	// willSendResponse
}

// COMPLETE:
@Injectable()
export class GraphqlService implements GqlOptionsFactory {
	constructor(private readonly authService: AuthService) {}

	async createGqlOptions(): Promise<GqlModuleOptions> {
		return {
			typePaths: ['./**/*.graphql'],
			resolvers: { JSON: GraphQLJSON, JSONObject: GraphQLJSONObject },
			extensions: [() => new MyErrorTrackingExtension()],
			mocks: NODE_ENV === 'testing' && {
				// String: () => 'Chnirt',
				Query: () => ({
					users: () => new MockList([2, 6])
				})
			},
			resolverValidationOptions: {
				requireResolversForResolveType: false
			},
			path: `/${END_POINT}`,
			cors:
				NODE_ENV === 'production'
					? {
							origin: FE_URL,
							credentials: true // <-- REQUIRED backend setting
					  }
					: true,
			bodyParserConfig: { limit: '50mb' },
			onHealthCheck: () => {
				return new Promise((resolve, reject) => {
					// Replace the `true` in this conditional with more specific checks!
					if (true) {
						resolve()
					} else {
						reject()
					}
				})
			},
			// definitions: {
			// 	path: join(process.cwd(), 'src/graphql.ts'),
			// 	outputAs: 'class'
			// },
			schemaDirectives,
			introspection: true,
			playground: NODE_ENV !== 'production' && {
				settings: {
					'editor.cursorShape': 'underline', // possible values: 'line', 'block', 'underline'
					'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
					'editor.fontSize': 14,
					'editor.reuseHeaders': true, // new tab reuses headers from last tab
					'editor.theme': 'dark', // possible values: 'dark', 'light'
					'general.betaUpdates': true,
					'queryPlan.hideQueryPlanResponse': false,
					'request.credentials': 'include', // possible values: 'omit', 'include', 'same-origin'
					'tracing.hideTracingResponse': false
				}
				// tabs: [
				// 	{
				// 		endpoint: END_POINT,
				// 		query: '{ hello }'
				// 	}
				// ]
			},
			tracing: NODE_ENV !== 'production',
			cacheControl: NODE_ENV === 'production' && {
				defaultMaxAge: 5,
				stripFormattedExtensions: false,
				calculateHttpHeaders: false
			},
			context: async ({ req, res, connection }) => {
				if (connection) {
					return {
						req: connection.context,
						pubSub
					}
				}

				let currentUser

				// console.log(ACCESS_TOKEN, req.headers)

				const token = req.headers[ACCESS_TOKEN] || ''

				// console.log('token', token)
				if (token) {
					currentUser = await this.authService.verifyToken(token)
				}

				return {
					req,
					res,
					pubSub,
					currentUser,
					trackErrors(errors) {
						// Track the errors
						// console.log(errors)
					}
				}
			},
			formatError: error => {
				// console.log(error)
				if (error.originalError instanceof AuthenticationError) {
					return new Error('Different authentication error message!')
				}

				return error
			},
			formatResponse: response => {
				// console.log(response)
				return response
			},
			subscriptions: {
				path: `/${END_POINT}`,
				keepAlive: 1000,
				onConnect: async (connectionParams, webSocket, context) => {
					NODE_ENV !== 'production' &&
						Logger.debug(`🔗  Connected to websocket`, 'GraphQL')

					let currentUser

					const token = connectionParams['token']

					if (token) {
						currentUser = await this.authService.verifyToken(token)

						return { currentUser }
					}

					throw new ApolloError('currentUser Required', '499', {})
				},
				onDisconnect: (webSocket, context) => {
					NODE_ENV !== 'production' &&
						Logger.error(`❌  Disconnected to websocket`, 'GraphQL')
				}
			},
			persistedQueries: {
				cache: new MemcachedCache(
					['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
					{ retries: 10, retry: 10000 } // Options
				)
			},
			installSubscriptionHandlers: true,
			uploads: false
		}
	}
}
