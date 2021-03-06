import { Injectable } from '@angular/core';
import {
  Household, HouseholdsPayload,
  RemovalPayload,
  DeleteHousehold_Mutation,
  RemoveUserFromHousehold_Mutation, EditHousehold_Mutation,
  User
} from "../graphql.types";
import {map, Observable} from "rxjs";
import {Apollo, gql} from "apollo-angular";
import {HouseholdHelperService} from "../cache-helpers/household-helper.service";

// GraphQL Queries
export const DeleteHousehold_GQL = gql`
  mutation deleteHousehold($householdId: Int!)
  {
    deleteHousehold(householdId: $householdId)
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

export const EditHousehold_GQL = gql`
  mutation editHousehold($householdId: Int!, $name: String!, $location: String!) {
    editHousehold(householdId: $householdId, name: $name, location: $location) {
      error, households
      {
        id, name, location
      }
    }
  }
`

/**
 * Provides GraphQL Api calls for functions needed solely by the HouseholdManagement component
 */
@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  constructor(private apollo: Apollo,
              private householdHelper: HouseholdHelperService) { }

  /**
   * Remove user from the household
   * Only valid for the owner of the household
   * @param user
   * @param household
   */
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

            //Use modify to remove user from household array
            store.modify({
              id: "Household:" + household.id,
              fields: {
                users(existingRefs = [], {readField}) {
                  return existingRefs.filter((ref: any) => user.id != readField('id', ref));
                }
              }
            });
          }
        }
      }
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

  /**
   * Remove the household from the application
   * This removes EVERYTHING in the household
   * @param household
   */
  removeHousehold(household: Household): Observable<RemovalPayload> {
    return this.apollo.mutate<DeleteHousehold_Mutation>(
      {
        mutation: DeleteHousehold_GQL,
        variables: {
          householdId: household.id,
        },
        update: (store, {data: payload}) => {
          //If we have removed the household
          if (payload && payload.deleteHousehold.success) {
            this.householdHelper.removeHousehold(household);
          }
        }
      }
    ).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(","), success:0, id:-1};
      } else if (!result.data?.deleteHousehold) {
        return {error: "An unknown error occurred", success:0, id:-1};
      } else {
        return result.data.deleteHousehold;
      }
    }));
  }

  /**
   * Update the household with new name and location, if changed
   * @param household
   */
  updateHousehold(household: Household): Observable<HouseholdsPayload> {
    return this.apollo.mutate<EditHousehold_Mutation>(
      {
        mutation: EditHousehold_GQL,
        variables: {
          householdId: household.id,
          name: household.name,
          location: household.location
        },
        update: (store, {data: payload}) => {
          //If we have removed the household
          if (payload && !payload.editHousehold.error) {
            this.householdHelper.editHousehold(household);
          }
        }
      }
    ).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(","), households: []};
      } else if (!result.data?.editHousehold) {
        return {error: "An unknown error occurred", households: []};
      } else {
        return result.data.editHousehold;
      }
    }));
  }
}
