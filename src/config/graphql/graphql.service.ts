import { Injectable, Inject, Logger } from '@nestjs/common'
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql'
import { MemcachedCache } from 'apollo-server-cache-memcached'
import { PubSub } from 'graphql-subscriptions'
// import { join } from 'path'
import { ApolloError } from 'apollo-server-core'
import { Logger as winstonLogger } from 'winston'
import * as dotenv from 'dotenv'
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'
import schemaDirectives from './directives'
import { AuthService } from '../../auth/auth.service'
import config from '../../config.env'
import { MockList } from 'graphql-tools'
dotenv.config()

const pubSub = new PubSub()
const { end_point } = config

// COMPLETE:
@Injectable()
export class GraphqlService implements GqlOptionsFactory {
	constructor(
		@Inject('winston') private readonly logger: winstonLogger,
		private readonly authService: AuthService
	) {}

	async createGqlOptions(): Promise<GqlModuleOptions> {
		return {
			typePaths: ['./**/*.graphql'],
			resolvers: { JSON: GraphQLJSON, JSONObject: GraphQLJSONObject },
			mocks: process.env.NODE_ENV === 'testing' && {
				Query: () => ({
					users: () => new MockList([0, 2])
				})
			},
			mockEntireSchema: process.env.NODE_ENV === 'testing' && false,
			resolverValidationOptions: {
				requireResolversForResolveType: false
			},
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
			path: `/${end_point}`,
			// definitions: {
			// 	path: join(process.cwd(), 'src/graphql.ts'),
			// 	outputAs: 'class'
			// },
			schemaDirectives,
			introspection: true,
			playground: process.env.NODE_ENV !== 'production' && {
				settings: {
					'editor.cursorShape': 'block', // possible values: 'line', 'block', 'underline'
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
				// 		endpoint: end_point,
				// 		query: '{ hello }'
				// 	}
				// ]
			},
			tracing: process.env.NODE_ENV === 'production' && true,
			cacheControl: process.env.NODE_ENV === 'production' && {
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

				const { token } = req.headers

				if (token) {
					currentUser = await this.authService.verifyToken(token)
				}

				return {
					req,
					res,
					pubSub,
					currentUser
				}
			},
			formatError: error => {
				// this.logger.error('✖️ ' + JSON.stringify(err.message), 'Error')
				return error
			},
			formatResponse: response => {
				// console.log(response)
				return response
			},
			subscriptions: {
				path: `/${end_point}`,
				keepAlive: 1000,
				onConnect: async (connectionParams, webSocket, context) => {
					process.env.NODE_ENV !== 'production' &&
						Logger.log(`🔗  Connected to websocket`, 'GraphQL')

					let currentUser

					const token = connectionParams['token']

					if (token) {
						currentUser = await this.authService.verifyToken(token)

						return { currentUser }
					}

					throw new ApolloError('currentUser Required', '499', {})
				},
				onDisconnect: (webSocket, context) => {
					process.env.NODE_ENV !== 'production' &&
						Logger.log(`❌  Disconnected to websocket`, 'GraphQL')
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
