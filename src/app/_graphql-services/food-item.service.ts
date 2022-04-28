import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {
  AddFoodItem_Mutation,
  FoodItem,
  GetSuggestions_Mutation,
  RemovalPayload,
  DeleteFoodItem_Mutation,
  SuggestionPayload,
  EditFoodItem_Mutation
} from "../graphql.types";
import {map, Observable} from "rxjs";
import {FoodItemHelperService} from "../cache-helpers/food-item-helper.service";


//GraphQL Queries
export const AddFoodItem = gql`
  mutation addFoodItem($storageId: Int!, $name: String!, $tags:[String], $filename:String) {
    addFoodItemToStorage(name: $name, storageId: $storageId, tags: $tags, filename:$filename)
    {
      foodItems
      {id, name, storage {id, name, type}, enteredBy {name}, tags, filename}
      error
    }
  }
`

export const EditFoodItem = gql`
  mutation editFoodItem($foodItemId: Int!, $name: String!, $tags:[String], $expiration: String) {
    editFoodItem(foodItemId: $foodItemId, name: $name, expiration: $expiration, tags: $tags)
    {
      foodItems {id, name, storage {id, name, type}, enteredBy {name}, tags, expiration},
      error
    }
  }
`

export const DeleteFoodItem = gql`
  mutation deleteFoodItem($foodItemId: Int!) {
    deleteFoodItem(foodItemId: $foodItemId)
    {
      success,
      id,
      error
    }
  }
`

export const GetSuggestions = gql`
  mutation getSuggestions($image: String) {
    getSuggestions(image: $image)
    {
      suggestion{name, tags, filename},
      error
    }
  }
`

/**
 * This service provides API access to FoodItem related queries and mutations via GraphQL
 */
@Injectable({
  providedIn: 'root'
})
export class FoodItemService {

  constructor(private apollo: Apollo,
              private foodItemHelper: FoodItemHelperService) {
  }

  /**
   * Add a FoodItem to the storage identified by storageId
   */
  addFoodItem(foodItem: FoodItem): Observable<any> {
    return this.apollo.mutate<AddFoodItem_Mutation>(
      {
        mutation: AddFoodItem,
        variables: {
          storageId: foodItem.storage!.id,
          name: foodItem.name,
          tags: foodItem.tags,
          filename: foodItem.filename
        },
        update: (store, {data: payload}) => {
          //If we have a fooditem to update
          if (payload && payload.addFoodItemToStorage.foodItems) {
            this.foodItemHelper.addFoodItem(payload.addFoodItemToStorage.foodItems[0]);
          }
        }
      }
    ).pipe(map((result) => result.data));
  }

  /**
   * Edit the foodItem
   * @param foodItem FoodItem to edit
   */
  editFoodItem(foodItem: FoodItem): Observable<any> {
    return this.apollo.mutate<EditFoodItem_Mutation>(
      {
        mutation: EditFoodItem,
        variables: {
          foodItemId: foodItem.id,
          name: foodItem.name,
          tags: foodItem.tags,
          expiration: foodItem.expiration
        },
        update: (store, {data: payload}) => {
          if (payload && payload.editFoodItem.foodItems) {
            this.foodItemHelper.editFoodItem(payload.editFoodItem.foodItems[0])
          }
        }
      }
    ).pipe(map((result) => result.data));
  }

  /**
   * Remove a FoodItem
   * @param foodItem FoodItem to remove
   */
  removeFoodItem(foodItem: FoodItem): Observable<RemovalPayload> {
    return this.apollo.mutate<DeleteFoodItem_Mutation>(
      {
        mutation: DeleteFoodItem,
        variables: {
          foodItemId: foodItem.id
        },
        update: (store, {data: payload}) => {
          if (payload && payload.deleteFoodItem.success) {
            this.foodItemHelper.removeFoodItem(foodItem);
          }
        }
      }
    ).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        let payload: RemovalPayload = {error: result.errors.join(","), success: 0, id: -1};
        return payload;
      } else if (!result.data?.deleteFoodItem) {
        let payload: RemovalPayload = {"error": "An unknown error occurred", success: 0, id: -1};
        return payload;
      } else {
        return result.data.deleteFoodItem;
      }
    }));
  }

  /**
   * Get AI suggestions and the UUID filename for a given Base64 encoded image
   * @param image Base64 Encoded image
   */
  getSuggestions(image: string | undefined): Observable<SuggestionPayload> {
    return this.apollo.mutate<GetSuggestions_Mutation>(
      {
        mutation: GetSuggestions,
        variables:
          {
            image: image
          }
      }
    ).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        let payload: SuggestionPayload = {error: result.errors.join(",")};
        return payload;
      } else if (!result.data?.getSuggestions) {
        let payload: SuggestionPayload = {error: "An unknown error occurred"};
        return payload;
      } else {
        return result.data.getSuggestions;
      }
    }));
  }
}
