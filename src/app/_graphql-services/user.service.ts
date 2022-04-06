import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {
  AddHousehold_Mutation,
  ChangeDefaultHousehold_Mutation,
  Household,
  HouseholdsPayload,
  LeaveHousehold_Mutation,
  RemovalPayload,
} from "../graphql.types";
import {map, Observable} from "rxjs";
import {HOUSEHOLD_CORE, READ_MY_USER} from "../graphql.fragments";

export const AddHousehold = gql`
  mutation createHousehold($name: String!, $location: String!)
  {
    createHousehold(name: $name, location: $location)
    {
      households
      {
         ...HouseholdCore
      },
      error
    }
  }
  ${HOUSEHOLD_CORE}
`;


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

export const LeaveHousehold_GQL = gql`
  mutation leaveHousehold($householdId: Int!) {
    leaveHousehold(householdId: $householdId) {
      error,
      success
    }
  }
`


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) {
  }

  /**
   * Change the default household for a user to the given household
   * The default household is the one a user will see when logging in
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
                fragment MyUserDefaultHousehold on User {
                  defaultHousehold
                  {
                    ...HouseholdCore
                  }
                }
                ${HOUSEHOLD_CORE}
              `,
              data: {defaultHousehold},
              fragmentName:"MyUserDefaultHousehold"
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

   leaveHousehold(household: Household, userId:number): Observable<RemovalPayload> {
    return this.apollo.mutate<LeaveHousehold_Mutation>(
      {
        mutation: LeaveHousehold_GQL,
        variables: {householdId: household.id},
        update: (store, {data: payload}) => {
          //Make sure we have a payload
          if (payload && payload.leaveHousehold.success) {
            //If we were successful, remove this household from memberHouseholds
            //Get the current user from cache
            const data = store.readFragment<any>({
              id: "User:" + userId,
              fragment: READ_MY_USER,
              fragmentName: "ReadMyUser"
            });
            //Make sure we have data in the cache (we bloody should)
            if (data) {
              console.log("Updating cache");
              let memberHouseholds = [...data.memberHouseholds];
              let index = memberHouseholds.indexOf(household);
              memberHouseholds.splice(index, 1);

              //Write our change back to the cache
              store.writeFragment({
                id: "User:" + userId, fragment: gql`
                  # noinspection GraphQLSchemaValidation
                  fragment MyUserUpdateMemberHouseholds on User {
                     memberHouseholds
                  }`, data: {memberHouseholds}
              });
            }
          }
        }
      }
    ).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(","), success:0, id:-1};
      } else if (!result.data?.leaveHousehold) {
        return {error: "An unknown error occurred", success:0, id:-1};
      } else {
        return result.data.leaveHousehold;
      }
    }));
  }

  /**
   * Add a household owned by the current user
   * @param household
   */
  addHousehold(household: Household): Observable<HouseholdsPayload> {
    return this.apollo.mutate<AddHousehold_Mutation>(
      {
        mutation: AddHousehold,
        variables: household,
        update: (store, {data: payload}) => {
          //If we have a household to add
          if (payload && payload.createHousehold.households) {
            //Add a household needs to be added to member and owned households
            //So we need a user ID
            const userId = payload.createHousehold.households[0].owner!.id;
            const household = payload.createHousehold.households[0];
            //Get the current user from cache
            const data = store.readFragment<any>({
              id: "User:" + userId,
              fragment: gql`
                fragment ReadMyUser on User
                {
                  id,
                  memberHouseholds {
                    id, name, location, owner{
                      id, name
                    }
                    storages {
                      id, name, type
                    }
                  },
                  ownedHouseholds {
                    id, name, location
                  }
                }
              `
            });
            //Make sure we have data in the cache (we bloody should)
            if (data) {
              console.log("Updating cache");
              let memberHouseholds = [...data.memberHouseholds, household];
              let ownedHouseholds = [...data.ownedHouseholds, household];

              //Write our change back to the cache
              store.writeFragment({
                id: "User:" + userId, fragment: gql`
                  # noinspection GraphQLSchemaValidation
                  fragment MyUserUpdate on User {
                     memberHouseholds {
                        id, name, location, owner{
                          id, name
                        }
                        storages {
                          id, name, type
                        }
                      },
                      ownedHouseholds {
                        id, name, location
                      }
                  }`, data: {memberHouseholds, ownedHouseholds}
              });

            }
          }
        }
      }
    ).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(",")};
      } else if (!result.data?.createHousehold) {
        return {error: "An unknown error occurred"};
      } else {
        return result.data.createHousehold;
      }
    }));
  }


}
