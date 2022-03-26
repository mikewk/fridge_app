import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Apollo, gql} from "apollo-angular";

import {AuthPayload, Login_Mutation, Signup_Mutation} from '../graphql.types'

//GraphQL Constants
const LoginGQL = gql`
  mutation login($email: String!, $password: String!){
    login(email:$email, password:$password)
    {
      error,
      user
      {
        id,
        name,
        defaultHousehold {
          id,
          name,
          location,
          owner {id, name},
          storages {
            id, name, foodItems {id}
          }
        },
        memberHouseholds {
          id,
          name,
          location
          owner{
            id, name
          }
          storages {
            id, name, type
          }
        },
        ownedHouseholds {
          id,
          name,
          location
        }
      }
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
      user
      {
        id,
        name,
        defaultHousehold {
          id,
          name,
          location,
          owner {id, name},
          storages {
            id, name, foodItems {id}
          }
        },
        memberHouseholds {
          id,
          name,
          location,
          owner {
            id, name
          },
          storages {
            id, name, type
          }
        },
        ownedHouseholds {
          id,
          name,
          location
        }
      }
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
}
