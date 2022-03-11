import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {FoodItem, FoodItemsPayload} from "../types";
import {map, Observable} from "rxjs";
import {GetStorage} from "./storage.service";

export const AddFoodItem = gql`
  mutation addFoodItem($storageId: Int!, $name: String!, $tags:[String]) {
    addFoodItemToStorage(name: $name, storageId: $storageId, tags: $tags)
    {
      foodItems
      {id, name, storageId, enteredBy {name}, tags}
      error
    }
  }
`

@Injectable({
  providedIn: 'root'
})
export class FoodItemService {

  constructor(private apollo: Apollo) {
  }

  addFoodItem(storageId: number, foodItem: FoodItem): Observable<any> {
    return this.apollo.mutate<FoodItemsPayload>(
      {
        mutation: AddFoodItem,
        refetchQueries: [
          {
            query: GetStorage,
            variables: {storageId: storageId}
          }
        ],
        variables:
          {
            storageId: storageId,
            name: foodItem.name,
            tags: foodItem.tags
          }
      }
    ).pipe(map((result) => result.data));
  }
}
