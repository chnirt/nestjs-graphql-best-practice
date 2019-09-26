import { onError } from 'apollo-link-error'

const errorMiddleware = onError(({
  // graphQLErrors,
  networkError
}) => {
  // if (graphQLErrors) {
  //   graphQLErrors.map(({ message, locations, path }) => console.error(`[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}`))
  // }
  if (networkError) {
    console.error(`[Network Error]: ${networkError}`)
  }
})

export { errorMiddleware }
