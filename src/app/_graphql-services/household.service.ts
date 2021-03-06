import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {map, Observable} from "rxjs";
import {
  GetHousehold_Query,
  GetMemberHouseholds_Query,
  HouseholdsPayload
} from "../graphql.types";
import { STORAGE_FIELDS} from "../graphql.fragments";

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
        {
          ...StorageFields
        }
      },
      error
    }
  },
  ${STORAGE_FIELDS}
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


}
