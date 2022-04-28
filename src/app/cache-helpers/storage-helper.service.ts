import { Injectable } from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {Messages_Payload, QL_Storage} from "../graphql.types";
import {STORAGE_FIELDS} from "../graphql.fragments";
import {ApolloCache} from "@apollo/client/cache";

/**
 * Helper class for Storage subscription messages
 */
@Injectable({
  providedIn: 'root'
})
export class StorageHelperService {

  store: ApolloCache<any>;
  constructor(private apollo: Apollo) {
    this.store = this.apollo.client.cache;
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
        this.updateStorage(storage);
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
    const cache = this.store;  // Create a reference that can be used inside the modify function

    // use cache.modify to update the household storagel ist
    cache.modify({
        id: "Household:" + householdId,
        fields: {
          storages(existingStorageRefs = []) {
            // Get the cache reference to the storage that was just added
            const newStorageRef = cache.writeFragment({
              data: storage,
              fragment: gql`
                fragment ThisStorage on Storage {
                  id, name
                }
              `
            });
            // return the new array with this storage added
            return [...existingStorageRefs, newStorageRef];
          }
        }
      }
    );
  }

  updateStorage(storage: QL_Storage) {
    /*const data = this.readStoragesFromCache(storage.householdId);
    //If we have a storages array, which we should even if it's empty
    if (data.storages) {
      //Find the storage in the household
      let index = data.storages.findIndex((item: { id: number | undefined; }) => item.id == storage.id);
      //Check to see if it's in storages, in case it's been removed already somehow
      if( index != -1 ) {
        let newStorages = [...data.storages];
        //Edit our storage
        let newStorage = Object.assign({}, newStorages[index])
        newStorage.name = storage.name
        newStorage.type = storage.type;
        newStorages[index] = newStorage;
        this.writeStoragesToCache(storage.householdId, newStorages);
      }
    }*/
  }

  /**
   * Remove the storage from it's household
   * @param storage
   */
  removeStorage(storage: QL_Storage) {
    const cache = this.store; // Create a reference that can be used inside the modify function

    // Use cache.modify to remove just the reference from the storages array
    cache.modify({
        id: "Household:" + storage.householdId,
        fields: {
          storages(existingStorageRefs = [], {readField} ) {
            return existingStorageRefs.filter( (x:any)=>storage.id!=readField('id', x));
          }
        }
      }
    );
    //clean up the cache
    cache.gc();

  }

}
