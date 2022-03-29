import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {map, Observable} from "rxjs";
import {
  AddHousehold_Mutation,
  GetHousehold_Query,
  GetMemberHouseholds_Query,
  Household,
  HouseholdsPayload, RemovalPayload
} from "../graphql.types";

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
}
