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
    //Get the current user from cache
    const data = this.readUserFromCache(userId);
    //Make sure we have data in the cache (we bloody should)
    if (data) {
      console.log("Updating cache");
      let memberHouseholds = [...data.memberHouseholds, household];
      //Write our change back to the cache
      this.updateMemberHouseholds(userId, memberHouseholds);

      //If we don't have a default, then let's set this to default and switch to it
      if( !data.defaultHousehold )
      {
        this.changeDefault(household);
        //We're accepting an invite, we can't be the owner
        this.localStorage.switchHousehold(household.id, "member");
      }
    }
  }

  /**
   * Update memberHouseholds and defaultHousehold by removing the household just left
   * Does not update ownedHouseholds as a user can't leave a household they own, they must remove it instead
   * @param household
   */
  leaveHousehold(household: Household)
  {
    const userId = this.localStorage.getUser()?.id!;
    //If we were successful, remove this household from memberHouseholds
    //Get the current user from cache
    const data = this.readUserFromCache(userId);
    //Make sure we have data in the cache (we bloody should)
    if (data) {
      console.log("Updating cache");
      let memberHouseholds = data.memberHouseholds.filter((x:Household)=>x.id!=household.id)
      let defaultHousehold = data.defaultHousehold;
      this.updateMemberHouseholds(userId, memberHouseholds);

      //Update Default Household if we're leaving it
      defaultHousehold = this.fixDefaultHousehold(defaultHousehold, household.id, memberHouseholds);
      //Evict this household's data from the catch
      this.store.evict({id: "Household:"+household.id});
      //GC things
      this.store.gc();

      //Check if this was the selected household, switch to default
      this.checkSelected(household.id, data.id, defaultHousehold);
    }
  }

  /**
   * Add the new household to member and owned households.  Update default if necessary
   * @param household
   */
  addHousehold(household: Household)
  {
    //Add a household needs to be added to member and owned households
    //So we need a user ID
    const userId = this.localStorage.getUser()?.id!;
    //Get the current user from cache
    const data = this.readUserFromCache(userId);
    //Make sure we have data in the cache (we bloody should)
    if (data) {
      console.log("Updating cache");
      let memberHouseholds = [...data.memberHouseholds, household];
      let ownedHouseholds = [...data.ownedHouseholds, household];
      this.updateMemberHouseholds(userId, memberHouseholds)
      this.updateOwnedHouseholds(userId, ownedHouseholds);
      if( !data.defaultHousehold ) {
        this.changeDefault(household);
        this.localStorage.switchHousehold(household.id, "owner");
      }

    }
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
    //Get the current user from cache
    const data = this.readUserFromCache(userId);
    //Make sure we have data in the cache (we bloody should)
    if (data) {
      console.log("Updating cache");
      this.store.evict({id: "Household:"+householdId});

      //Remove household from member and owned households
      let memberHouseholds = data.memberHouseholds.filter((x:Household)=>x.id!=householdId)
      let ownedHouseholds = data.ownedHouseholds.filter((x:Household)=>x.id!=householdId)
      let defaultHousehold = data.defaultHousehold

      //Try fixing up default household if we just removed it
      defaultHousehold = this.fixDefaultHousehold(defaultHousehold, householdId, memberHouseholds);
      this.updateOwnedHouseholds(userId, ownedHouseholds);
      this.updateMemberHouseholds(userId, memberHouseholds);


      //We may have evicted stuff, so GC it all
      this.store.gc();
      //Check if this was the selected household, switch to default
      this.checkSelected(household.id, data.id, defaultHousehold);
    }
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
   * Update cache for userId with the new memberHouseholds array
   * @param userId
   * @param memberHouseholds
   * @private
   */
  private updateMemberHouseholds(userId: number, memberHouseholds: any[]) {
    //Write our change back to the cache
    this.store.writeFragment({
      id: "User:" + userId, fragment: gql`
        # noinspection GraphQLSchemaValidation
        fragment MyUserUpdateMemberHouseholds on User {
          memberHouseholds
        }`, data: {memberHouseholds}
    });
  }

  /**
   * Update cache for userId with new ownedHouseholds array
   * @param userId
   * @param ownedHouseholds
   * @private
   */
  private updateOwnedHouseholds(userId: number, ownedHouseholds: any[])
  {
    this.store.writeFragment({
        id: "User:" + userId, fragment: gql`
          # noinspection GraphQLSchemaValidation
          fragment MyUserUpdateOwnedHouseholds on User {
            ownedHouseholds
          }`, data: {ownedHouseholds}
      });
  }

  /**
   * Check if the household we're removing or leaving is the same as default, if so find a new default if we can
   * @param defaultHousehold
   * @param householdId
   * @param memberHouseholds
   * @private
   */
  private fixDefaultHousehold(defaultHousehold: Household, householdId: number, memberHouseholds: Household[]) {
    let newDefault: Household|null = defaultHousehold;
    if (defaultHousehold.id == householdId) {
      newDefault = null;
      if (memberHouseholds.length > 0) {
        newDefault = memberHouseholds[0]
      }
      this.changeDefault(newDefault);
    }
    return newDefault;
  }

  /**
   * Check if the household we're removing or leaving is the same as the selected household
   * Select the default if it exists
   * @param householdId
   * @param userId
   * @param defaultHousehold
   * @private
   */
  private checkSelected(householdId: number, userId: number, defaultHousehold: Household | null) {
    if (this.localStorage.selectedHouseholdId.getValue() == householdId) {
      let userType = "member";
      if (userId == defaultHousehold?.owner!.id)
        userType = "owner";
      this.localStorage.switchHousehold(defaultHousehold?.id, userType)
    }
  }

}
