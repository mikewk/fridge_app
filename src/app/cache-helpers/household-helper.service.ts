import { Injectable } from '@angular/core';
import {FoodItem, Household, Messages_Payload} from "../graphql.types";
import {Apollo, gql} from "apollo-angular";
import {HOUSEHOLD_CORE, READ_MY_USER} from "../graphql.fragments";
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
      case "changeDefault":
        this.changeDefault(household);
        break;
    }
  }

  changeDefault(defaultHousehold: Household)
  {
    const store = this.apollo.client.cache;
    const userId = this.localStorage.getUser()?.id!;
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

  leaveHousehold(household: Household)
  {
    const store = this.apollo.client.cache;
    const userId = this.localStorage.getUser();
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

  addHousehold(household: Household)
  {
    //Add a household needs to be added to member and owned households
    //So we need a user ID
    const userId = this.localStorage.getUser()?.id;
    const store = this.apollo.client.cache;
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

  editHousehold(household: Household)
  {
    //TODO: Implement edit household end to end
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
