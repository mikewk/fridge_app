import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Apollo, gql} from "apollo-angular";

import {AuthPayload} from '../graphql.types'

//GraphQL Constants
const LoginGQL = gql`
      mutation login($email: String!, $password: String!){
        login(email:$email, password:$password)
        {
          error,
          token
        }
      }
`;
const RegisterGQL = gql`
      mutation register($email: String!, $password: String!, $name: String!) {
        signup(email:$email, name:$name, password:$password)
        {
          error,
          token
        }
      }
`;
/**
 * This class implements an authorization service.
 * It interacts with the Fridge Tracking API via GraphQL to send authentication credentials
 * or registration information
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) {
  }

  /**
   * Login via GraphQL
   */
  login(email: string, password: string): Observable<any> {
    return this.apollo.mutate<AuthPayload>({
      mutation: LoginGQL,
      variables:
        {
          email: email,
          password: password
        }
    }).pipe(map((result) => result.data));
  }
  /**
   * Register for account via GraphQL
   */
  register(name: string, email: string, password: string): Observable<any> {
    return this.apollo.mutate<AuthPayload>({
      mutation: RegisterGQL,
      variables:
        {
          email: email,
          name: name,
          password: password
        }
    }).pipe(map((result) => result.data));
  }
}
