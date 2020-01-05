import ApolloClient, { InMemoryCache } from 'apollo-boost';
import fetch from 'isomorphic-fetch';

// creates a new client instance( should the serve change, the url needs to be updated)
export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  fetch,
  cache:new InMemoryCache()
});