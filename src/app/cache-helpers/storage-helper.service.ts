import { Injectable } from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {Messages_Payload, QL_Storage} from "../graphql.types";
import {STORAGE_FIELDS} from "../graphql.fragments";

@Injectable({
  providedIn: 'root'
})
export class StorageHelperService {

  constructor(private apollo: Apollo) {

  }

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

  addStorage(storage: QL_Storage) {
    const store = this.apollo.client.cache;
    const householdId = storage.householdId;
    //Get the current household
    const data = store.readFragment<any>({
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
    })
    //If we have a storages array, which we should even if it's empty
    if (data.storages) {
      //Make a new array of storages
      const newStorages = [...data.storages, storage]
      //Write our change back to the cache
      store.writeFragment({
        id: "Household:" + householdId, fragment: gql`
          # noinspection GraphQLSchemaValidation
          fragment MyHousehold on Household {
            storages
          }`, data: {storages: newStorages}
      });
    }
  }

  editStorage(storage: QL_Storage) {

  }

  removeStorage(storage: QL_Storage) {
    const store = this.apollo.client.cache;
    const data = store.readFragment<any>({
    id: "Household:" + storage.householdId,
    fragment: gql`
    fragment MyHouseholdStorages on Household
    {
       storages {
         ...StorageFields
       }
    }
    ${STORAGE_FIELDS}
    `, fragmentName: "MyHouseholdStorages"
    })
    //If we have a storages array, which we should even if it's empty
    if (data.storages) {
      //Find the storage in the household
      let index = data.storages.findIndex((item: { id: number | undefined; }) => item.id == storage.id);
      let newStorages = [...data.storages];
      newStorages.splice(index, 1);
      store.writeFragment({
        id: "Household:" + storage.householdId, fragment: gql`
        # noinspection GraphQLSchemaValidation
        fragment MyHousehold on Household {
         storages
        }`, data: {storages: newStorages}
      });
    }
  }
}
