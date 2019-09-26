import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { WebSocketLink } from 'apollo-link-ws'
// import { SubscriptionClient } from 'subscriptions-transport-ws'
import { getMainDefinition } from 'apollo-utilities'

import { errorMiddleware } from './middleware'

const domain = window.location.host // 'tms2.digihcs.com'
const endPoint = `${process.env.END_POINT}`

const urn = process.env.GRAPHQL_URN || `${domain}/${endPoint}`

const httpLink = new HttpLink({
  uri: `${process.env.SSL === true ? 'https' : 'http'}://${urn}`
})

const wsLink = new WebSocketLink({
  uri: `${process.env.SSL === true ? 'wss' : 'ws'}://${urn}`,
  options: {
    reconnect: true,
    connectionParams: () => ({
      token: window.localStorage.getItem('access-token') || ''
    })
  }
})

// const httpLink = new HttpLink({
//   uri:
//     process.env.HTTP_LINK
//     || `${process.env.SSL === 'true' ? 'https' : 'http'}://${
//       window.location.host
//     }/${process.env.SERVICE}/${process.env.GRAPH_QL_PATH}`
// })

// const wsClient = new SubscriptionClient(
//   process.env.WS_LINK
//     || `${process.env.SSL === 'true' ? 'wss' : 'ws'}://${window.location.host}/${
//       process.env.SERVICE
//     }/${process.env.GRAPH_QL_PATH}`,
//   {
//     reconnect: true,
//     connectionParams: () => ({
//       token: localStorage.getItem('access-token') || ''
//     })
//   }
// )

// const wsLink = new WebSocketLink(wsClient)

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    token: localStorage.getItem('access-token') || ''
  }
}))

const linkSplit = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const link = ApolloLink.from([errorMiddleware, linkSplit])

const Client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache()
})

export { Client }
