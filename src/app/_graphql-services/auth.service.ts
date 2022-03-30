import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Apollo, gql} from "apollo-angular";

import {
  AuthPayload,
  GetUser_Query,
  Login_Mutation,
  RefreshToken_Mutation,
  Signup_Mutation,
  UsersPayload
} from '../graphql.types'
import {USER_FIELDS} from "../graphql.fragments";

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
const RefreshToken_GQL = gql`
  mutation refreshToken
  {
    refreshToken
    {
      error,
      token
    }
  }
`
export const GetUser_GQL = gql`
  query getUser {
    getUser {
      error,
      users{
        ...UserFields
      }
    }
  }
  ${USER_FIELDS}

`


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
  login(email: string, password: string): Observable<AuthPayload> {
    return this.apollo.mutate<Login_Mutation>({
      mutation: LoginGQL,
      variables:
        {
          email: email,
          password: password
        }
    }).pipe(map((result) => {
      if (result.errors) {
        let payload: AuthPayload = {error: result.errors.join(","), token: ""};
        return payload;
      } else if (!result.data?.login) {
        let payload: AuthPayload = {"error": "No data returned", token: ""};
        return payload;
      } else {
        return result.data.login;
      }
    }));
  }

  /**
   * Register for account via GraphQL
   */
  register(name: string, email: string, password: string): Observable<AuthPayload> {
    return this.apollo.mutate<Signup_Mutation>({
      mutation: RegisterGQL,
      variables:
        {
          email: email,
          name: name,
          password: password
        }
    }).pipe(map((result) => {
      if (result.errors) {
        let payload: AuthPayload = {error: result.errors.join(","), token: ""};
        return payload;
      } else if (!result.data?.signup) {
        let payload: AuthPayload = {"error": "No data returned", token: ""};
        return payload;
      } else {
        return result.data.signup;
      }
    }));
  }

  refreshToken(): Observable<AuthPayload>
  {
    return this.apollo.mutate<RefreshToken_Mutation>({
      mutation: RefreshToken_GQL
    }).pipe(map((result) => {
      if (result.errors) {
        let payload: AuthPayload = {error: result.errors.join(","), token: ""};
        return payload;
      } else if (!result.data?.refreshToken) {
        let payload: AuthPayload = {"error": "No data returned", token: ""};
        return payload;
      } else {
        return result.data.refreshToken;
      }
    }));
  }

  /**
  * Gets the user object for the currently logged-in user
  */
  getUser(): Observable<UsersPayload>
  {
    return this.apollo.watchQuery<GetUser_Query>({
      query: GetUser_GQL,

    }).valueChanges.pipe(map((result) => {
      if (result.errors) {
        return  {error: result.errors.join(","), users: undefined};
      } else if (!result.data?.getUser) {
        return {"error": "No data returned", users: undefined};
      } else {
        return result.data.getUser;
      }
    }));
  }



}
