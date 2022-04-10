import { Injectable } from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {Messages_Payload, QL_Storage} from "../graphql.types";
import {STORAGE_FIELDS} from "../graphql.fragments";
import {ApolloCache} from "@apollo/client/cache";

@Injectable({
  providedIn: 'root'
})
export class StorageHelperService {

  store: ApolloCache<any>;
  constructor(private apollo: Apollo) {
    this.store = apollo.client.cache;
  }

  /**
   * Do the action in the message using the storage in the message
   * @param message
   */
  doMessage(message: Messages_Payload)
  {
    const storage: QL_Storage = <QL_Storage>message.message;
    switch(message.action)
    {
      case "add":
        this.addStorage(storage);
        break;
      case "edit":
        this.editStorage(storage);
        break;
      case "remove":
        this.removeStorage(storage);
        break;
    }
  }

  /**
   * Add the new storage to the household
   * @param storage
   */
  addStorage(storage: QL_Storage) {
    const householdId = storage.householdId;
    //Get the current household
    const data = this.readStoragesFromCache(householdId)
    //If we have a storages array, which we should even if it's empty
    if (data.storages) {
      //Make a new array of storages
      const newStorages = [...data.storages, storage]
      //Write our change back to the cache
      this.writeStoragesToCache(householdId, newStorages);
    }
  }

  editStorage(storage: QL_Storage) {

  }

  /**
   * Remove the storage from it's household
   * @param storage
   */
  removeStorage(storage: QL_Storage) {
    const data = this.readStoragesFromCache(storage.householdId);
    //If we have a storages array, which we should even if it's empty
    if (data.storages) {
      //Find the storage in the household
      let index = data.storages.findIndex((item: { id: number | undefined; }) => item.id == storage.id);
      //Check to see if it's in storages, in case it's been removed already somehowrede4444
      if( index != -1 ) {
        let newStorages = [...data.storages];
        newStorages.splice(index, 1);
        this.writeStoragesToCache(storage.householdId, newStorages);
      }
    }
  }

  /**
   * Write the array of storages to the household assigned to householdId
   * @param householdId
   * @param newStorages
   * @private
   */
  private writeStoragesToCache(householdId: number | undefined, newStorages: any[]) {
    this.store.writeFragment({
      id: "Household:" + householdId, fragment: gql`
        # noinspection GraphQLSchemaValidation
        fragment MyHousehold on Household {
          storages
        }`, data: {storages: newStorages}
    });
  }

  /**
   * Read the storages linked to the household of assigned HouseholdId
   * @param householdId
   * @private
   */
  private readStoragesFromCache(householdId: number | undefined) {
    return this.store.readFragment<any>({
      id: "Household:" + householdId,
      fragment: gql`
        fragment MyHouseholdStorages on Household
        {
          storages {
            ...StorageFields
          }
        }
        ${STORAGE_FIELDS}
      `, fragmentName: "MyHouseholdStorages"
    });
  }
}
