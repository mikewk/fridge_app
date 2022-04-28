import { Injectable } from '@angular/core';
import {Household, Messages_Payload} from "../graphql.types";
import {Apollo, gql} from "apollo-angular";
import {HOUSEHOLD_CORE, READ_MY_USER} from "../graphql.fragments";
import {LocalStorageService} from "../_services/local-storage.service";
import {ApolloCache} from "@apollo/client/cache";

/**
 * A series of functions to help update the cache for Household operations
 */
@Injectable({
  providedIn: 'root'
})
export class HouseholdHelperService {

  store: ApolloCache<any>;
  constructor(private apollo: Apollo,
              private localStorage: LocalStorageService) {
    this.store = this.apollo.client.cache;
  }

  /**
   * Executes the message payload by selecting an action and sending the payload household to the appropriate function
   * @param message
   */
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
      case "change_default":
        this.changeDefault(household);
        break;
      case "accept_invite":
        this.acceptInvite(household);
        break;
      case "leave":
        this.leaveHousehold(household);
        break;
      case "remove_from":  //Remove from is effectively the same as leaving
        this.leaveHousehold(household);
        break;
    }
  }

  /**
   * Change the defaultHousehold
   * @param defaultHousehold
   */
  changeDefault(defaultHousehold: Household | null)
  {
    const userId = this.localStorage.getUser()?.id!;
    this.store.writeFragment({
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
      fragmentName: "MyUserDefaultHousehold"
    });
  }

  /**
   * Update memberHouseholds and possibly defaultHousehold for the one we just added
   * @param household
   */
  acceptInvite(household: Household)
  {
    const userId = this.localStorage.getUser()?.id!;
    this.addHouseholdToUser(this.store, userId, household)


  }

  /**
   * This can actually just use the remove household logic, as the backend prevents leaving an owned household
   * We will leave the function in place for consistency and if the logic changes in the future
   * @param household
   */
  leaveHousehold(household: Household)
  {
    this.removeHousehold(household);
  }

  /**
   * Add the new household to member and owned households.  Update default if necessary
   * @param household
   */
  addHousehold(household: Household)
  {
    const userId = this.localStorage.getUser()?.id!
    const cache = this.store;

    // Use cache.modify to add this household to the arrays and update default if necessary
    this.addHouseholdToUser(cache, userId, household, true);

  }

  /**
   * Adds household to user, taking note to properly manage whether or not the user created the household
   * or accepted an invite
   * @param cache
   * @param userId
   * @param household
   * @param owner
   * @private
   */
  private addHouseholdToUser(cache: ApolloCache<any>, userId: number, household: Household, owner: boolean = false) {
    const householdRef = cache.writeFragment({
      data: household,
      fragment: gql`
      fragment ThisHousehold on Household {
        id
      }
      `
    });
    cache.modify({
      id: "User:" + userId,
      fields: {
        memberHouseholds(existingRefs = [], {readField}) {
          return [...existingRefs, householdRef];
        },
        ownedHouseholds(existingRefs = [], {readField}) {
          if( owner )
            return [...existingRefs, householdRef];
          else
            return existingRefs;
        },
        defaultHousehold(existingRef, {readField}) {
          if (existingRef == null) {
            return householdRef;
          } else {
            return existingRef;
          }
        }
      }
    });

    const defaultHousehold = this.fixDefaultHousehold(userId);
    //Check if there was no selected household, and switch it to the default (which will be this household)
    this.checkSelected(undefined, userId, defaultHousehold);
  }

  editHousehold(household: Household)
  {
    // Discovered that we may not need the "edit" updaters after all.  This may disappear next push
  }

  /**
   * Remove household from cache by removing from memberHouseholds, ownedHouseholds, and default household
   * @param household
   */
  removeHousehold(household: Household)
  {
    const userId = this.localStorage.getUser()?.id!
    const householdId = household.id
    const cache = this.store;

    // Use cache.modify to remove this household from all arrays
    cache.modify({
        id: "User:" + userId,
        fields: {
          memberHouseholds(existingRefs = [], {readField}) {
            return existingRefs.filter((ref: any) => householdId != readField('id', ref));
          },
          ownedHouseholds(existingRefs = [], {readField}) {
            return existingRefs.filter((ref: any) => householdId != readField('id', ref));
          },
          defaultHousehold(existingRef, {readField}) {
            if (readField('id', existingRef) == householdId) {
              return null;
            } else {
              return existingRef
            }
          }
        }
      }
    );
    const defaultHousehold = this.fixDefaultHousehold(userId);
    //Evict and GC it all
    this.store.evict({id: "Household:"+householdId});
    this.store.gc();
    //Check if this was the selected household, switch to default
    this.checkSelected(householdId, userId, defaultHousehold);
  }
   /**
   * Read the user from the cache.
   * @param userId
   * @private
   */
  private readUserFromCache(userId: number) {
    return this.store.readFragment<any>({
      id: "User:" + userId,
      fragment: READ_MY_USER,
      fragmentName: "ReadMyUser"
    });
  }

  /**
   * Check if the household we're removing or leaving is the same as default, if so find a new default if we can
   * @private
   * @param userId
   */
  private fixDefaultHousehold(userId: number) {
    let user = this.readUserFromCache(userId);
    if( !user.defaultHousehold ) {
      if( user.memberHouseholds.length > 0 ) {
        this.changeDefault(user.memberHouseholds[0]);
        return user.memberHouseholds[0];
      }
      else {
        return undefined;
      }
    }
    else {
      return user.defaultHousehold;
    }
  }

  /**
   * Check if the household we're removing or leaving is the same as the selected household
   * Select the default if it exists
   * @param householdId
   * @param userId
   * @param defaultHousehold
   * @private
   */
  private checkSelected(householdId: number | undefined, userId: number, defaultHousehold: Household | undefined) {
    if (this.localStorage.selectedHouseholdId.getValue() == householdId) {
      let userType = "member";
      if (userId == defaultHousehold?.owner!.id)
        userType = "owner";
      this.localStorage.switchHousehold(defaultHousehold?.id, userType)
    }
  }

}
