import { Injectable, Inject } from '@nestjs/common'
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql'
import { MemcachedCache } from 'apollo-server-cache-memcached'
import { UserService } from '../../modules/user/user.service'
import { PubSub } from 'graphql-subscriptions'
import { join } from 'path'
import { ApolloError } from 'apollo-server-core'
import { UserPermissionService } from '../../modules/userPermission/userPermission.service'
import { Logger } from 'winston'

import config from '../../config.env'

const pubSub = new PubSub()

const end_point = config.end_point

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
	constructor(
		@Inject('winston') private readonly logger: Logger,
		private readonly userService: UserService,
		private readonly userPermissionService: UserPermissionService
	) {}

	async createGqlOptions(): Promise<GqlModuleOptions> {
		const directiveResolvers = {
			isAuthenticated: (next, source, args, ctx) => {
				const message = 'Token Required'
				const code = '499'
				const additionalProperties = {}

				const { currentUser } = ctx

				if (!currentUser) {
					throw new ApolloError(message, code, additionalProperties)
				}

				return next()
			},
			hasPermission: async (next, source, args, ctx) => {
				const message = 'Token Required'
				const code = '499'
				const additionalProperties = {}

				const { currentUser, currentsite } = ctx

				if (!currentUser) {
					throw new ApolloError(message, code, additionalProperties)
				}

				const { permission } = args

				await this.userPermissionService.findOne({
					// tslint:disable-next-line:object-literal-key-quotes
					userId: currentUser._id,
					// tslint:disable-next-line:object-literal-key-quotes
					siteId: currentsite,
					'permissions.code': permission
				})

				return next()
			}
		}

		return {
			typePaths: ['./**/*.graphql'],
			path: `/${end_point}`,
			definitions: {
				path: join(process.cwd(), 'src/graphql.ts'),
				outputAs: 'class'
			},
			directiveResolvers,
			context: async ({ req, res, connection }) => {
				if (connection) {
					return {
						req: connection.context,
						pubSub
					}
				}

				let currentUser = ''

				const { token, currentsite } = req.headers

				if (token) {
					currentUser = await this.userService.findOneByToken(token)
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
				this.logger.error('✖️ ' + JSON.stringify(err), 'Error')
				return err
			},
			formatResponse: err => {
				// console.log(err)
				return err
			},
			debug: false,
			subscriptions: {
				path: `/${end_point}`,
				onConnect: (connectionParams, webSocket, context) => {
					console.log('🔗 Connected to websocket')
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
