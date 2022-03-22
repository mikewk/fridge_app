import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {map, Observable} from "rxjs";
import {AddStorageToHousehold_Mutation, GetStorage_Query, QL_Storage, StoragesPayload} from "../graphql.types";
import {GetHousehold} from "./household.service"

//GraphQL Queries
export const GetStorage = gql`
  query getStorage($storageId: Int!) {
    getStorage(storageId: $storageId)
    {
      storages
      {id, name, type, foodItems {id, name, tags, storage {id, name, type}, filename}}
      error
    }
  }
`
export const AddStorageGQL = gql`
  mutation addStorage($id: Int!, $name: String!, $type: String!){
    addStorageToHousehold(householdId:$id, name:$name, storageType:$type)
    {
      error,
      storages
      {
        id, name, type
      }
    }
  }
`;

/**
 * This service provides API access to Storage related queries and mutations via GraphQL
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private apollo: Apollo) {
  }

  /**
   * Add a storage to the household identified by id
   */
  addStorage(id: number, storage: QL_Storage): Observable<StoragesPayload> {
    return this.apollo.mutate<AddStorageToHousehold_Mutation>({
      mutation: AddStorageGQL,
      refetchQueries: [
        {
          query: GetHousehold,
          variables: {householdId: id}
        }
      ],
      variables:
        {
          id: id,
          name: storage.name,
          type: storage.type
        }
    }).pipe(map((result) => {
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
      if (result.errors) {
        return {error: result.errors.join(",")};
      } else if (!result.data?.getStorage) {
        return {error: "An unknown error occurred"};
      } else {
        return result.data.getStorage;
      }
    }));
  }
}
