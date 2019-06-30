import { Injectable } from '@nestjs/common'
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql'
import { MemcachedCache } from 'apollo-server-cache-memcached'
import { UserService } from '../../modules/user/user.service'
import { PubSub } from 'graphql-subscriptions'
import { GraphQLError } from 'graphql'
import { join } from 'path'

const pubSub = new PubSub()

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
	constructor(private readonly userService: UserService) {}

	async createGqlOptions(): Promise<GqlModuleOptions> {
		const directiveResolvers = {
			isAuthenticated: (next, source, args, ctx) => {
				const { currentUser } = ctx

				if (!currentUser) {
					throw new Error('You are not authenticated!')
				}

				return next()
			},
			hasRole: (next, source, args, ctx) => {
				const { role } = args
				const { currentUser } = ctx

				if (!currentUser) {
					throw new Error('You are not authenticated!')
				}

				if (role !== currentUser.role) {
					throw new Error(
						`Must have role: ${role}, you have role: ${currentUser.role}`
					)
				}
				return next()
			}
		}

		return {
			typePaths: ['./**/*.graphql'],
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

				const { token } = req.headers

				if (token) {
					currentUser = await this.userService.findOneByToken(token)
				}

				return {
					req,
					res,
					pubSub,
					currentUser
				}
			},
			formatError: err => {
				// console.log(err)
				return err
			},
			formatResponse: err => {
				// console.log(err)
				return err
			},
			debug: false,
			subscriptions: {
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
			playground: {
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
