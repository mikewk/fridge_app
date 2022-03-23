import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {ChangeDefaultHousehold_Mutation, Household, UsersPayload} from "../graphql.types";
import {map, Observable} from "rxjs";

const ChangeDefaultHousehold_GQL = gql`
  mutation changeDefaultHousehold($householdId: Int!) {
    changeDefaultHousehold(householdId: $householdId)
    {
      error,
      users {
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
        },
        ownedHouseholds {
          id,
          name,
          location
        }
      }
    }
  }


`


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) {
  }

  changeDefault(household: Household): Observable<UsersPayload> {
    return this.apollo.mutate<ChangeDefaultHousehold_Mutation>({
      mutation: ChangeDefaultHousehold_GQL,
      variables:
        {
          householdId: household.id
        }
    }).pipe(map((result) => {
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
