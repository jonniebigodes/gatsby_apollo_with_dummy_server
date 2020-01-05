import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { client } from './client';

// exports a HOC that will allow the entire app to communicate with the graphql backend.
export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
);