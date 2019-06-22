import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { GraphQLFactory, GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { MemcachedCache } from 'apollo-server-cache-memcached';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { EventsGateway } from './events/events.gateway';

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

@Module({
  imports: [
    GraphQLModule.forRoot({
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
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://chnirt:chin04071803@ds055690.mlab.com:55690/nest-graphql',
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
      useNewUrlParser: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    EventsModule,
  ],
  providers: [EventsGateway],
})
export class AppModule {}
