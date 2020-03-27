import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import ApolloClient from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import './styles/styles.scss'

import App from './components/App'


const cache = new InMemoryCache({
  // The first argument, id, is the unique identifier 
  // that was assigned to the object you want to read from the cache.
  // This should match the value that your dataIdFromObject function assigned to the object when it was stored.
  // if we don't provide an id inside of a query we don't ask for
  // an id then Apollo will not be able to identify that piece of data witch
  // is definitely not what we want to have happen.

  // ...,
  dataIdFromObject: object => object.id
})
const link = new HttpLink({
  uri: 'http://localhost:4000/graphql'
})

const client = new ApolloClient({
  cache,
  link
})

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  )
}

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
