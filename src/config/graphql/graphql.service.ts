import { Injectable, Inject, Next } from '@nestjs/common'
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql'
import { MemcachedCache } from 'apollo-server-cache-memcached'
import { PubSub } from 'graphql-subscriptions'
// import { join } from 'path'
import { ApolloError } from 'apollo-server-core'
import { Logger } from '@nestjs/common'
import { Logger as winstonLogger } from 'winston'
import { getMongoRepository } from 'typeorm'
import * as dotenv from 'dotenv'
import * as GraphQLJSON from 'graphql-type-json'
import * as formatDate from 'dateformat'
import { AuthService } from '../../auth/auth.service'
import { UserPermission } from '../../models'
import config from '../../config.env'

dotenv.config()
const pubSub = new PubSub()
const end_point =
	process.env.NODE_ENV === 'testing' ? 'graphqllunch' : config.end_point

// COMPLETE:
@Injectable()
export class GraphqlService implements GqlOptionsFactory {
	constructor(
		@Inject('winston') private readonly logger: winstonLogger,
		private readonly authService: AuthService
	) {}

	async createGqlOptions(): Promise<GqlModuleOptions> {
		const directiveResolvers = {
			isAuthenticated: (next, src, args, ctx) => {
				const { currentUser, currentsite } = ctx

				if (!currentUser || !currentsite) {
					throw new ApolloError('currentUser & currentsite Required', '499', {})
				}

				return next()
			},
			hasPermission: async (next, src, args, ctx) => {
				const { currentUser, currentsite } = ctx

				if (!currentUser) {
					throw new ApolloError('Invalid Token', '498', {})
				}

				const { permission } = args

				// console.log(currentUser, currentsite, permission)

				const userpermission = await getMongoRepository(UserPermission).findOne({
					userId: currentUser._id,
					siteId: currentsite
				})

				// console.log(userpermission)

				const { permissions } = userpermission

				const index = permissions.map(item => item.code).indexOf(permission)

				if (index === -1) {
					throw new ApolloError('Unauthorized', '401', {})
				}

				return next()
			},
			upper: async (next, src, args, ctx) => {
				return next().then(str => {
					if (typeof str === 'string') {
						return str.toUpperCase()
					}
					return str
				})
			},
			concat: async (next, src, args, ctx) => {
				return next().then(str => {
					if (typeof str !== 'undefined') {
						return `${str}${args.value}`
					}
					return str
				})
			},
			date: async (next, src, args, ctx) => {
				const { format } = args
				return next().then(date => {
					return formatDate(new Date(date), format)
				})
			}
		}

		return {
			typePaths: ['./**/*.graphql'],
			resolvers: { JSON: GraphQLJSON },
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
			directiveResolvers,
			context: async ({ req, res, connection }) => {
				if (connection) {
					return {
						req: connection.context,
						pubSub
					}
				}

				let currentUser

				const { token, currentsite } = req.headers

				if (token) {
					currentUser = await this.authService.verifyToken(token)
				}

				return {
					req,
					res,
					pubSub,
					currentUser,
					currentsite
				}
			},
			formatError: err => {
				// this.logger.error('✖️ ' + JSON.stringify(err.message), 'Error')
				return err
			},
			formatResponse: err => {
				// console.log(err)
				return err
			},
			debug: true,
			subscriptions: {
				path: `/${end_point}`,
				onConnect: async (connectionParams, webSocket, context) => {
					Logger.log(`🔗  Connected to websocket`, 'GraphQL')

					let currentUser

					const token = connectionParams['token']
					const currentsite = connectionParams['currentsite']

					if (token) {
						currentUser = await this.authService.verifyToken(token)

						return { currentUser, currentsite }
					}

					throw new ApolloError('currentUser & currentsite Required', '499', {})
				},
				onDisconnect: (webSocket, context) => {
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
			introspection: true,
			playground: process.env.NODE_ENV !== 'production' && {
				settings: {
					'editor.cursorShape': 'line', // possible values: 'line', 'block', 'underline'
					'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
					'editor.fontSize': 14,
					'editor.reuseHeaders': true, // new tab reuses headers from last tab
					'editor.theme': 'dark', // possible values: 'dark', 'light'
					'general.betaUpdates': false,
					'queryPlan.hideQueryPlanResponse': false,
					'request.credentials': 'include', // possible values: 'omit', 'include', 'same-origin'
					'tracing.hideTracingResponse': true
				}
			}
		}
	}
}
