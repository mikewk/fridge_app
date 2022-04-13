import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
// Apollo
import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {ApolloClientOptions, InMemoryCache, split} from '@apollo/client/core';
import { persistCacheSync, SessionStorageWrapper} from "apollo3-cache-persist";
import {HttpLink} from 'apollo-angular/http';
import {environment} from "../environments/environment";
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import * as http from "http";




//Replace this URI with your own endpoint if you want to run your own API server somewhere else
//const uri = 'https://fridge.michealkok.com/api/graphql';
const wsUri = environment.graphql_wsUri;
const httpUri = environment.graphql_httpUri;

const cache = new InMemoryCache();
persistCacheSync({cache,
  storage: new SessionStorageWrapper(window.sessionStorage)});


function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  let wsClient;
  try {
    wsClient = new WebSocketLink({
      uri: wsUri,
      options: {
        reconnect: true,
      }
    });
  } catch(error) {
    wsClient = null;
  }
  const httpClient = httpLink.create({uri: httpUri});
  let link;
  if( wsClient ) {
    link = split(({query}) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
        );
      },
      wsClient,
      httpClient,
    );
  }
  else {
    link = httpClient;
  }
  return {
    link: link,
    cache: cache,
    defaultOptions: {
      watchQuery: {
          fetchPolicy: 'cache-and-network',
          errorPolicy: 'ignore',
          nextFetchPolicy(lastFetchPolicy) {
            if (lastFetchPolicy === "cache-and-network") {
              return "cache-first";
            }
            return lastFetchPolicy;
          }
      },
      query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
      },
      mutate: {
          errorPolicy: 'all'
      }
    }
  };
}

@NgModule({
  exports: [ApolloModule, HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
}
