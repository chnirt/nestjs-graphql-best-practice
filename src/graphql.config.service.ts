import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import { MemcachedCache } from 'apollo-server-cache-memcached';
import { UserService } from './user/user.service';

@Injectable()
export class GraphqlConfigService implements GqlOptionsFactory {
  // constructor(private readonly userService: UserService) {}
  async createGqlOptions(): Promise<GqlModuleOptions> {
    const directiveResolvers = {
      isAuthenticated: (next, source, args, ctx) => {
        // if (role === user.role) return next();
        // throw new Error(`Must have role: ${role}, you have role: ${user.role}`);
        // console.log(args);
        console.log('isAuthenticated');
        return next();
      },
      hasRole: (next, source, { role }, ctx) => {
        // console.log(role);
        // if (role === user.role) return next();
        // throw new Error(`Must have role: ${role}, you have role: ${user.role}`);
        console.log('hasRole');
        return next();
      },
    };

    return {
      typePaths: ['./**/*.graphql'],
      directiveResolvers,
      context: ({ req, connection }) =>
        connection ? { req: connection.context } : { req },
      debug: false,
      subscriptions: {
        onConnect: (connectionParams, webSocket, context) => {
          console.log('🔗 Connected to websocket');
        },
      },
      persistedQueries: {
        cache: new MemcachedCache(
          ['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
          { retries: 10, retry: 10000 }, // Options
        ),
      },
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
          'tracing.hideTracingResponse': true,
        },
      },
    };
  }
}
