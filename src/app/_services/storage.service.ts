import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {map, Observable} from "rxjs";
import {QL_Storage, StoragesPayload} from "../graphql.types";
import {GetHousehold} from "./household.service"

//GraphQL Queries
export const GetStorage = gql`
  query getStorage($storageId: Int!) {
    getStorage(storageId: $storageId)
    {
      storages
      {id, name, type, foodItems {id, name, tags, storageId, filename}}
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
  addStorage(id: number, storage: QL_Storage): Observable<any> {
    return this.apollo.mutate<StoragesPayload>({
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
    }).pipe(map((result) => result.data));
  }

  /**
   * Get the storage identified by id
   */
  getStorage(id: number): Observable<any> {
    return this.apollo.query<StoragesPayload>(
      {
        query: GetStorage,
        variables:
          {
            storageId: id
          }
      }
    ).pipe(map((result) => result.data));
  }
}
