import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { createContext } from 'react';
import { getToken } from '../../utils/tokenStorage';
import { setContext } from '@apollo/client/link/context';

const httpLinkUsers = new HttpLink({ uri: 'http://192.168.43.94:3000/graphql' });

const authLink = setContext(async (_, { headers }) => {
    const token = await getToken();
    return {
    headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
    }
};
});

export const clientUser = new ApolloClient({
    link: ApolloLink.from([authLink, httpLinkUsers]),
    cache: new InMemoryCache(),
});

export const ApolloClientsContext = createContext({ clientUser });
