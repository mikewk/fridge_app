import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Apollo, gql} from "apollo-angular";

import {
  AuthPayload,
  GetUser_Query,
  Login_Mutation,
  RefreshToken_Mutation, SendPasswordReset_Mutation,
  Signup_Mutation, TryPasswordReset_Mutation,
  UsersPayload
} from '../graphql.types'
import {USER_FIELDS} from "../graphql.fragments";
import {environment} from "../../environments/environment";

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

const SendPasswordReset_GQL = gql`
  mutation sendPasswordReset($email: String!, $urlRoot: String!, $urlSignature: String!){
    sendPasswordReset(email:$email, urlRoot:$urlRoot, urlSignature: $urlSignature)
  }
`;


const TryPasswordReset_GQL = gql`
  mutation tryPasswordReset($password: String!, $key: String!){
    tryPasswordReset(password: $password, key: $key)
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
        return {error: result.errors.join(","), token: ""};
      } else if (!result.data?.login) {
        return {"error": "No data returned", token: ""};
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
        return {error: result.errors.join(","), token: ""};
      } else if (!result.data?.signup) {
        return {"error": "No data returned", token: ""};
      } else {
        return result.data.signup;
      }
    }));
  }

  /**
   * Call the refresh token mutation and get a new token with updated expiration
   */
  refreshToken(): Observable<AuthPayload>
  {
    return this.apollo.mutate<RefreshToken_Mutation>({
      mutation: RefreshToken_GQL
    }).pipe(map((result) => {
      if (result.errors) {
        return {error: result.errors.join(","), token: ""};
      } else if (!result.data?.refreshToken) {
        return {"error": "No data returned", token: ""};
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

  /**
   * Start the password reset process for the account at email
   * We don't care if it actually works, because we don't want to let the user know if the account exists
   * @param email
   */
  sendPasswordReset(email: string): Observable<string>
  {
    return this.apollo.mutate<SendPasswordReset_Mutation>({
      mutation: SendPasswordReset_GQL,
      variables: {
        email: email,
        urlRoot: environment.invite_base_url,
        urlSignature: environment.url_signature
      }
    }).pipe(map((result)=>
    {
      if (result.errors) {
        return result.errors.join(",");
      } else if (!result.data?.sendPasswordReset) {
        return "No data returned";
      }
      else {
        return result.data?.sendPasswordReset;
      }
    }));
  }

  /**
   * Attempt a password reset for a given reset key with the new password
   * @param password
   * @param key
   */
  tryPasswordReset(password: string, key:string): Observable<string>
  {
    return this.apollo.mutate<TryPasswordReset_Mutation>({
      mutation: TryPasswordReset_GQL,
      variables: {
        password: password,
        key: key
      }
    }).pipe(map((result)=>
    {
      if (result.errors) {
        return result.errors.join(",");
      } else if (!result.data?.tryPasswordReset) {
        return "No data returned";
      }
      else {
        return result.data?.tryPasswordReset;
      }
    }));
  }
}
