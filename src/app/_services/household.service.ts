import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {map, Observable} from "rxjs";
import {HouseholdsPayload} from "../types";

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

@Injectable({
  providedIn: 'root'
})
export class HouseholdService {

  constructor(private apollo: Apollo) {
  }

  getMemberHouseholds(): Observable<any> {
    return this.apollo.query<HouseholdsPayload>({
      query: GetMemberHousehold
    }).pipe(map((result) => result.data));
  }

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


}
