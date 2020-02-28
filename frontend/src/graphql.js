import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import Cookies from 'universal-cookie';

const authLink = setContext((_, { headers }) => {
    var cookies = new Cookies();

    return {
        headers: {
            ...headers,
            user: cookies.get('user') ? `${cookies.get('user').userAuth}` : "",
        }
    }
});

export const SERVER_URL = "http://eventvise.com";
// export const SERVER_URL = "http://localhost:4000";

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(createUploadLink({ uri: `${SERVER_URL}/graphql` }))
});
