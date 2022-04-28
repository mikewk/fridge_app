import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {map, Observable} from "rxjs";
import {
  AddStorageToHousehold_Mutation,
  GetStorage_Query,
  QL_Storage,
  RemovalPayload, RemoveStorage_Mutation,
  StoragesPayload, UpdateStorage_Mutation
} from "../graphql.types";
import {StorageHelperService} from "../cache-helpers/storage-helper.service";
import {STORAGE_FIELDS} from "../graphql.fragments";

//GraphQL Queries
export const GetStorage = gql`
  query getStorage($storageId: Int!) {
    getStorage(storageId: $storageId)
    {
      storages
      {
        ...StorageFields
      }
      error
    }
  }
  ${STORAGE_FIELDS}
`
export const AddStorageGQL = gql`
  mutation addStorage($id: Int!, $name: String!, $type: String!){
    addStorageToHousehold(householdId:$id, name:$name, storageType:$type)
    {
      error,
      storages
      {
        ...StorageFields
      }
    }
  }
  ${STORAGE_FIELDS}
`;

export const DeleteStorage_GQL = gql`
    mutation deleteStorage($storageId: Int!) {
      deleteStorage(storageId: $storageId)
      {
        success,
        error
      }
    }
`

export const EditStorage_GQL = gql`
    mutation editStorage($storageId: Int!, $name: String!, $storageType: String!) {
      editStorage(storageId: $storageId, name: $name, storageType: $storageType)
      {
        error,
        storages
        {
          ...StorageFields
        }
      }
    }
    ${STORAGE_FIELDS}
`

/**
 * This service provides API access to Storage related queries and mutations via GraphQL
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private apollo: Apollo,
              private storageHelper: StorageHelperService) {
  }

  /**
   * Add a storage to the household identified by householdId
   * @param storage
   * @param householdId
   */
  addStorage(storage: QL_Storage, householdId: number): Observable<StoragesPayload> {
    return this.apollo.mutate<AddStorageToHousehold_Mutation>({
      mutation: AddStorageGQL,
      variables:
        {
          id: householdId,
          name: storage.name,
          type: storage.type
        },
      update: (store, {data: payload}) => {
        if (payload && payload.addStorageToHousehold.storages) {
          this.storageHelper.addStorage(payload.addStorageToHousehold.storages[0]);
        }
      }
    }).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(",")};
      } else if (!result.data?.addStorageToHousehold) {
        return {error: "An unknown error occurred"};
      } else {
        return result.data.addStorageToHousehold;
      }
    }));
  }

  /**
   * Get the storage identified by id
   * @param id
   */
  getStorage(id: number): Observable<StoragesPayload> {
    return this.apollo.watchQuery<GetStorage_Query>(
      {
        query: GetStorage,
        variables:
          {
            storageId: id
          }
      }
    ).valueChanges.pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(",")};
      } else if (!result.data?.getStorage) {
        return {error: "An unknown error occurred"};
      } else {
        return result.data.getStorage;
      }
    }));
  }

  /**
   * Remove storage from household
   * Deletes all fooditems in the storage
   * @param storage
   */
  removeStorage(storage: QL_Storage): Observable<RemovalPayload> {
    return this.apollo.mutate<RemoveStorage_Mutation>(
      {
        mutation: DeleteStorage_GQL,
        variables: {
          storageId: storage.id
        },
         update: (store, {data: payload}) => {
           if (payload && payload.removeStorage.success) {
             //Write the removal back to the cache
             //Get the current household
            this.storageHelper.removeStorage(storage);
           }
         }
      }
    ).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(","), success:0, id:-1};
      } else if (!result.data?.removeStorage) {
        return {error: "An unknown error occurred", success:0, id:-1};
      } else {
        return result.data.removeStorage;
      }
    }));
  }

  /**
   * Update storage name and type, if changed
   * @param storage
   */
  updateStorage(storage: QL_Storage): Observable<StoragesPayload> {
    return this.apollo.mutate<UpdateStorage_Mutation>(
      {
        mutation: EditStorage_GQL,
        variables: {
          storageId: storage.id,
          name: storage.name,
          storageType: storage.type
        },
         update: (store, {data: payload}) => {
           if (payload && payload.updateStorage.storages) {
             //Write the removal back to the cache
             //Get the current household
            this.storageHelper.updateStorage(payload.updateStorage.storages[0]);
           }
         }
      }
    ).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(","), storages: []};
      } else if (!result.data?.updateStorage) {
        return {error: "An unknown error occurred", storages: []};
      } else {
        return result.data.updateStorage;
      }
    }));
  }
}
