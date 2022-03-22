import { Injectable } from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {
  AddStorageToHousehold_Mutation,
  ChangeDefaultHousehold_Mutation,
  Household,
  User,
  UsersPayload
} from "../graphql.types";
import {EMPTY, map, Observable} from "rxjs";
import {GetHousehold} from "./household.service";

const ChangeDefaultHousehold_GQL = gql`
  mutation changeDefaultHousehold($householdId: Int!) {
    changeDefaultHousehold(householdId: $householdId)
    {
      error,
      users {
        id,
        defaultHousehold {
          id,
          name,
          location
          storages {
            id, name, foodItems {id}
          }
        }
      }
    }
  }


`



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) { }

  changeDefault(household: Household): Observable<UsersPayload>
  {
     return this.apollo.mutate<ChangeDefaultHousehold_Mutation>({
      mutation: ChangeDefaultHousehold_GQL,
      variables:
        {
          householdId: household.id
        }
    }).pipe(map((result) =>{
      if( result.errors )
      {
        return {error:result.errors.join(",")};
      }
      else if( !result.data?.changeDefaultHousehold)
      {
        return {error:"An unknown error occurred"};
      }
      else {
        return result.data.changeDefaultHousehold;
      }
    }));
  }

}
