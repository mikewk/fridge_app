import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {map, Observable} from "rxjs";
import {
  AddHousehold_Mutation,
  GetHousehold_Query,
  GetMemberHouseholds_Query,
  Household,
  HouseholdsPayload, RemovalPayload, RemoveHousehold_Mutation, RemoveUserFromHousehold_Mutation, User
} from "../graphql.types";
import {HOUSEHOLD_CORE} from "../graphql.fragments";

//GraphQL Queries
export const GetHousehold = gql`
  query getHousehold($householdId: Int!) {
    getHousehold(householdId: $householdId)
    {
      households
      {
        id, name, location,
        owner {name, id},
        users {name, id},
        storages
        {id, name, type, foodItems {
          id, name, filename, tags, storage {
            id, name, type
          }
        }}
      },
      error
    }
  }
`;

export const GetMemberHousehold = gql`
  query {
    getMemberHouseholds
    {
      error, households {
      id, name, location, owner {
        id, name
      },
      users {
        id, name
      },
      storages {
        id, name, type, foodItems {
          name
        }
      }
    }
    }
  }
`;

export const AddHousehold = gql`
  mutation createHousehold($name: String!, $location: String!)
  {
    createHousehold(name: $name, location: $location)
    {
      households
      {
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
      error
    }
  }
`;

export const RemoveUserFromHousehold_GQL = gql`
  mutation removeUserFromHousehold($householdId: Int!, $userId: Int!) {
    removeUserFromHousehold(householdId: $householdId, userId: $userId) {
      error, success, id
    }
  }
`

export const RemoveHousehold_GQL = gql`
  mutation removeHousehold($householdId: Int!)
  {
    removeHousehold(householdId: $householdId)
    {
      success, error, id
    }
  }
`

/**
 * This service provides API access to Household related queries and mutations via GraphQL*
 */
@Injectable({
  providedIn: 'root'
})
export class HouseholdService {

  constructor(private apollo: Apollo) {
  }

  /**
   * Gets all households the authenticated user is a member of
   */
  getMemberHouseholds(): Observable<HouseholdsPayload> {
    return this.apollo.query<GetMemberHouseholds_Query>({
      query: GetMemberHousehold
    }).pipe(map((result) => {
      if (result.errors) {
        return {error: result.errors.join(",")};
      } else if (!result.data?.getMemberHouseholds) {
        return {error: "An unknown error occurred"};
      } else {
        return result.data.getMemberHouseholds;
      }
    }));
  }

  /**
   * Get the household identified by id
   * Returns an observable as this is the object the vast majority of our changes act upon
   * This observable is updated via RefetchQueries and Cache Updates
   */
  getHousehold(id: number): Observable<HouseholdsPayload> {
    return this.apollo.watchQuery<GetHousehold_Query>(
      {
        query: GetHousehold,
        variables:
          {
            householdId: id
          }
      }
    ).valueChanges.pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(",")};
      } else if (!result.data?.getHousehold) {
        return {error: "An unknown error occurred"};
      } else {
        return result.data.getHousehold;
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
          //If we have a fooditem to update
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


  removeMember(user: User, household: Household): Observable<RemovalPayload> {
    return this.apollo.mutate<RemoveUserFromHousehold_Mutation>(
      {
        mutation: RemoveUserFromHousehold_GQL,
        variables: {
          householdId: household.id,
          userId: user.id
        },
        update: (store, {data: payload}) => {
          //If we have a fooditem to update
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


  removeHousehold(household: Household, userId: number): Observable<RemovalPayload> {
    return this.apollo.mutate<RemoveHousehold_Mutation>(
      {
        mutation: RemoveHousehold_GQL,
        variables: {
          householdId: household.id,
        },
        update: (store, {data: payload}) => {
          //If we have removed the household
          if (payload && payload.removeHousehold.success) {
            //Removing the user from the household means removing from the users array
            //So we need a user ID and householdId
            const householdId = household.id
            //Get the current user from cache
            const data = store.readFragment<any>({
              id: "User:" + userId,
              fragment: gql`
                fragment ReadMyUser on User
                {
                  id,
                  memberHouseholds {
                    ...HouseholdCore
                  },
                  ownedHouseholds {
                    id, name, location
                  },
                  defaultHousehold {
                    ...HouseholdCore
                  }
                },
                ${HOUSEHOLD_CORE}
              `,
              fragmentName: "ReadMyUser"
            });
            //Make sure we have data in the cache (we bloody should)
            if (data) {
              console.log("Updating cache");
              let memberHouseholds = data.memberHouseholds.filter((x:Household)=>x.id!=householdId)
              let ownedHouseholds = data.ownedHouseholds.filter((x:Household)=>x.id!=householdId)
              let defaultHousehold = data.defaultHousehold

              //Try fixing up default household
              store.evict({id: "User:"+userId, fieldName:"defaultHousehold"});

              if( defaultHousehold.id == householdId )
              {
                if( memberHouseholds.length > 0 )
                  defaultHousehold = memberHouseholds[0];
                else
                  defaultHousehold = null;
              }

              store.writeFragment({
              id: "User:" + userId, fragment: gql`
                # noinspection GraphQLSchemaValidation
                fragment MyHouseholdResetDefault on User {
                  defaultHousehold
                }`, data: {defaultHousehold}});


              //Write our change back to the cache
              store.writeFragment({
                id: "User:" + userId, fragment: gql`
                  # noinspection GraphQLSchemaValidation
                  fragment MyUserRemoveHousehold on User {
                    memberHouseholds,
                    ownedHouseholds

                  }`, data: {memberHouseholds:memberHouseholds,
                             ownedHouseholds:ownedHouseholds}
              });
              store.gc();
            }
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
