import { Injectable } from '@angular/core';
import {FoodItem, Household, Messages_Payload} from "../graphql.types";
import {Apollo, gql} from "apollo-angular";
import {HOUSEHOLD_CORE} from "../graphql.fragments";
import {LocalStorageService} from "../_services/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class HouseholdHelperService {

  constructor(private apollo: Apollo,
              private localStorage: LocalStorageService) {

  }

  doMessage(message: Messages_Payload)
  {
    const household: Household = <Household>message.message;
    switch (message.action) {
      case "add":
        this.addHousehold(household);
        break;
      case "edit":
        this.editHousehold(household);
        break;
      case "remove":
        this.removeHousehold(household);
        break;
    }
    ''
  }

  addHousehold(household: Household)
  {

  }

  editHousehold(household: Household)
  {

  }

  removeHousehold(household: Household)
  {
    const store = this.apollo.client.cache;
    const userId = this.localStorage.getUser()?.id!
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

      //Try fixing up default household if we just removed it
      if( defaultHousehold.id == householdId )
      {

        store.evict({id: "User:"+userId, fieldName:"defaultHousehold"});
        if( memberHouseholds.length > 0 )
          defaultHousehold = memberHouseholds[0];
        else
          defaultHousehold = null;

        store.writeFragment({
          id: "User:" + userId, fragment: gql`
            # noinspection GraphQLSchemaValidation
            fragment MyHouseholdResetDefault on User {
              defaultHousehold
            }`, data: {defaultHousehold}});
      }

      //Write our other changes back to the cache
      store.writeFragment({
        id: "User:" + userId, fragment: gql`
          # noinspection GraphQLSchemaValidation
          fragment MyUserRemoveHousehold on User {
            memberHouseholds,
            ownedHouseholds

          }`, data: {memberHouseholds:memberHouseholds,
                     ownedHouseholds:ownedHouseholds}
      });
      //We may have evicted stuff, so GC it all
      store.gc();
    }
  }
}
