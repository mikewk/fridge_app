import { Injectable } from '@angular/core';
import {
  Household,
  RemovalPayload,
  RemoveHousehold_Mutation,
  RemoveUserFromHousehold_Mutation,
  User
} from "../graphql.types";
import {map, Observable} from "rxjs";
import {Apollo, gql} from "apollo-angular";
import {HouseholdHelperService} from "../cache-helpers/household-helper.service";

export const RemoveHousehold_GQL = gql`
  mutation removeHousehold($householdId: Int!)
  {
    removeHousehold(householdId: $householdId)
    {
      success, error, id
    }
  }
`

export const RemoveUserFromHousehold_GQL = gql`
  mutation removeUserFromHousehold($householdId: Int!, $userId: Int!) {
    removeUserFromHousehold(householdId: $householdId, userId: $userId) {
      error, success, id
    }
  }
`

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  constructor(private apollo: Apollo,
              private householdHelper: HouseholdHelperService) { }

  removeMember(user: User, household: Household): Observable<RemovalPayload> {
    return this.apollo.mutate<RemoveUserFromHousehold_Mutation>(
      {
        mutation: RemoveUserFromHousehold_GQL,
        variables: {
          householdId: household.id,
          userId: user.id
        },
        update: (store, {data: payload}) => {
          //If we have a removal payload to check
          if (payload && payload.removeUserFromHousehold.success) {
            //Removing the user from the household means removing from the users array
            //So we need a user ID and householdId
            const userId = user.id
            const householdId = household.id
            //Get the current user from cache
            const data = store.readFragment<any>({
              id: "Household:" + householdId,
              fragment: gql`
                fragment ReadMyHouseholdMembers on Household {
                  users {
                    id, name
                  }
                }
              `
            });

            //Make sure we have data in the cache (we bloody should)
            if (data) {
              console.log("Updating cache");
              const index= data.users.findIndex((user: { id: number })=> user.id == userId);
              let users = [...data.users];
              users.splice(index, 1);

              //Write our change back to the cache
              store.writeFragment({
                id: "Household:" + householdId, fragment: gql`
                  # noinspection GraphQLSchemaValidation
                  fragment UpdateMyHouseholdUsers on Household{
                     users {
                       id, name
                     }
                  }`, data: {users:users}
              });
      } } } }
    ).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(","), success:0, id:-1};
      } else if (!result.data?.removeUserFromHousehold) {
        return {error: "An unknown error occurred", success:0, id:-1};
      } else {
        return result.data.removeUserFromHousehold;
      }
    }));
  }


  removeHousehold(household: Household): Observable<RemovalPayload> {
    return this.apollo.mutate<RemoveHousehold_Mutation>(
      {
        mutation: RemoveHousehold_GQL,
        variables: {
          householdId: household.id,
        },
        update: (store, {data: payload}) => {
          //If we have removed the household
          if (payload && payload.removeHousehold.success) {
            this.householdHelper.removeHousehold(household);
          }
        }
      }
    ).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(","), success:0, id:-1};
      } else if (!result.data?.removeHousehold) {
        return {error: "An unknown error occurred", success:0, id:-1};
      } else {
        return result.data.removeHousehold;
      }
    }));
  }
}
