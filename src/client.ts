import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

const GITHUB_TOKEN = import.meta.env.VITE_REACT_APP_GITHUB_TOKEN;

const headersLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  });
  return forward(operation);
});

const endPoint = "https://api.github.com/graphql";
const httpLink = new HttpLink({ uri: endPoint });
const link = ApolloLink.from([headersLink, httpLink]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
