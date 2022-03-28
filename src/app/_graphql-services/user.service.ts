import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {
  AuthPayload,
  ChangeDefaultHousehold_Mutation, GetUser_Query,
  Household,
  HouseholdsPayload, Login_Mutation,
  UsersPayload
} from "../graphql.types";
import {EMPTY, map, Observable} from "rxjs";
import {HOUSEHOLD_CORE, USER_FIELDS} from "../graphql.fragments";

const ChangeDefaultHousehold_GQL = gql`
  mutation changeDefaultHousehold($householdId: Int!) {
    changeDefaultHousehold(householdId: $householdId) {
      error,
      households {
        ...HouseholdCore
      }
    }
  },
  ${HOUSEHOLD_CORE}
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


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) {
  }

  /**
   * Gets the user object for the currently logged in user
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
   * Chance the default household for a user to the given household
   * The default household is the one a user will see when relogging in
   * @param household
   * @param userId
   */
  changeDefault(household: Household, userId: number): Observable<HouseholdsPayload> {
    return this.apollo.mutate<ChangeDefaultHousehold_Mutation>({
      mutation: ChangeDefaultHousehold_GQL,
      variables:
        {
          householdId: household.id
        },
      update: (store, {data: payload}) => {
          if (payload && payload.changeDefaultHousehold.households) {
            //Write our change back to the cache
            let defaultHousehold = payload.changeDefaultHousehold.households[0];
            store.writeFragment({
              id: "User:" + userId, fragment: gql`
                fragment MyUser on User {
                  defaultHousehold
                  {
                    ${HOUSEHOLD_CORE}
                  }
                }`, data: {defaultHousehold}
            });
          }
        }
    }).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(",")};
      } else if (!result.data?.changeDefaultHousehold) {
        return {error: "An unknown error occurred"};
      } else {
        return result.data.changeDefaultHousehold;
      }
    }));
  }

}
