import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {map, Observable} from "rxjs";
import {Household, HouseholdsPayload} from "../graphql.types";

//GraphQL Queries
export const GetHousehold = gql`
  query getHousehold($householdId: Int!) {
      getHousehold(householdId: $householdId)
      {
        households
        {id, name, location, owner {name}, users {name}, storages {id, name, type}},
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
                name
              },
            users {
                name
              },
            storages {
              name, type, foodItems {
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
        id, name, location
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
  getMemberHouseholds(): Observable<any> {
    return this.apollo.query<HouseholdsPayload>({
      query: GetMemberHousehold
    }).pipe(map((result) => result.data));
  }

  /**
   * Get the household identified by id
   */
  getHousehold(id: number): Observable<any> {
    return this.apollo.query<HouseholdsPayload>(
      {
        query: GetHousehold,
        variables:
          {
            householdId: id
          }
      }
    ).pipe(map((result) => result.data));
  }

  addHousehold(household: Household): Observable<any> {
    return this.apollo.mutate<HouseholdsPayload>(
      {
        mutation: AddHousehold,
        variables: household
      }
    ).pipe(map((result) => result.data));
  }
}
