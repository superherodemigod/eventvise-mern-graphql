import ReactDOM from 'react-dom'
import React from 'react'

import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';


import { Provider } from "react-redux"
// import { Auth0Provider } from "./authServices/auth0/auth0Service"
// import config from "./authServices/auth0/auth0Config.json"
import { IntlProviderWrapper } from "./utility/context/Internationalization"
import { Layout } from "./utility/context/Layout"
import * as serviceWorker from "./serviceWorker"
import { store } from "./redux/storeConfig/store"
import Spinner from "./components/@vuexy/spinner/Fallback-spinner"
import { client } from './graphql'
import "./index.scss"
import "./@fake-db"

import App from './components/App.jsx'
import { BrowserRouter } from 'react-router-dom';

const ApolloApp = AppComponent => (
    // <BrowserRouter>
        <ApolloProvider client={client}>
            <AppComponent />
        </ApolloProvider>
    // </BrowserRouter>
);

ReactDOM.render(
    ApolloApp(App),
    document.getElementById('root'));

if (module.hot) {
    module.hot.accept(<App />, ReactDOM.render(ApolloApp(App), document.getElementById('root')))
}
