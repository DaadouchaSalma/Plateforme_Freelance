import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const uploadLink = createUploadLink({
  uri: "http://localhost:3000/graphql", 
});
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

export const client = new ApolloClient({
  //link: httpLink,
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
});