import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
// Apollo
import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {ApolloClientOptions, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import {environment} from "../environments/environment";

//Replace this URI with your own endpoint if you want to run your own API server somewhere else
//const uri = 'https://fridge.michealkok.com/api/graphql';
const uri = environment.graphql_uri;

function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
          fetchPolicy: 'cache-and-network',
          errorPolicy: 'ignore',
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
