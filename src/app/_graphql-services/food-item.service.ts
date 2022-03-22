import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {
  AddFoodItem_Mutation,
  FoodItem,
  GetStorage_Query,
  GetSuggestions_Mutation,
  RemovalPayload,
  RemoveFoodItem_Mutation,
  SuggestionPayload,
  UpdateFoodItem_Mutation
} from "../graphql.types";
import {map, Observable} from "rxjs";
import {GetStorage} from "./storage.service";
import {GetHousehold} from "./household.service";

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

export const UpdateFoodItem = gql`
  mutation updateFoodItem($foodItemId: Int!, $name: String!, $tags:[String], $expiration: String) {
    updateFoodItem(foodItemId: $foodItemId, name: $name, expiration: $expiration, tags: $tags)
    {
      foodItems {id, name, storage {id, name, type}, enteredBy {name}, tags, expiration},
      error
    }
  }
`

export const RemoveFoodItem = gql`
  mutation removeFoodItem($foodItemId: Int!) {
    removeFoodItem(foodItemId: $foodItemId)
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

  constructor(private apollo: Apollo) {
  }

  /**
   * Add a FoodItem to the storage identified by storageId
   */
  addFoodItem(foodItem: FoodItem): Observable<any> {
    return this.apollo.mutate<AddFoodItem_Mutation>(
      {
        mutation: AddFoodItem,
        refetchQueries: [GetHousehold],
        variables: {
          storageId: foodItem.storage!.id,
          name: foodItem.name,
          tags: foodItem.tags,
          filename: foodItem.filename
        },
        update: (store, {data: payload}) => {
          if (payload && payload.addFoodItemToStorage.foodItems) {
            const storageId = foodItem.storage?.id;
            //Get the current storage from cache
            const data = store.readQuery<GetStorage_Query>({query: GetStorage, variables: {storageId: storageId}});

            //Make sure we have data in the cache (we bloody should)
            if (data?.getStorage?.storages) {
              console.log("Updating cache");
              let foodItems;
              //If we have a food items array, spread it and add our new one to the end
              if (data.getStorage.storages[0].foodItems)
                foodItems = [...data.getStorage.storages[0].foodItems, payload.addFoodItemToStorage.foodItems[0]];
              //Otherwise, let's just use our array from the return payload
              else
                foodItems = payload.addFoodItemToStorage.foodItems;

              //Write our change back to the cache
              store.writeFragment({
                id: "Storage:" + storageId, fragment: gql`
                  # noinspection GraphQLSchemaValidation
                  fragment myStorage on Storage {
                    foodItems
                  }`, data: {foodItems}
              });

            }
          }
        }
      }
    ).pipe(map((result) => result.data));
  }

  editFoodItem(foodItem: FoodItem): Observable<any> {
    return this.apollo.mutate<UpdateFoodItem_Mutation>(
      {
        mutation: UpdateFoodItem,
        refetchQueries: [GetHousehold],
        variables: {
          foodItemId: foodItem.id,
          name: foodItem.name,
          tags: foodItem.tags,
          expiration: foodItem.expiration
        },
        update: (store, {data: payload}) => {
          if (payload && payload.updateFoodItem.foodItems) {
            //Write our change back to the cache
            let foodItem = payload.updateFoodItem.foodItems[0];
            store.writeFragment({
              id: "FoodItem:" + foodItem.id, fragment: gql`
                fragment myItem on FoodItem {
                  name,
                  tags,
                  expiration
                }`, data: {name: foodItem.name, tags: foodItem.tags, expiration: foodItem.expiration}
            });
          }
        }
      }
    ).pipe(map((result) => result.data));
  }

  removeFoodItem(foodItem: FoodItem): Observable<RemovalPayload> {
    return this.apollo.mutate<RemoveFoodItem_Mutation>(
      {
        mutation: RemoveFoodItem,
        refetchQueries: [GetHousehold],
        variables: {
          foodItemId: foodItem.id
        },
        update: (store, {data: payload}) => {
          if (payload && payload.removeFoodItem.success) {
            //Write our change back to the cache
            //First we need to remove the item from the storage
            let storageId = foodItem.storage?.id;
            let data = store.readQuery<GetStorage_Query>({query: GetStorage, variables: {storageId: storageId}});
            let foodItems: FoodItem[];
            //If we have a food items array, get it and remove our food item
            //If we don't have a food item array anymore... something something race condition we'll just do nothing
            if (data?.getStorage?.storages) {
              if (data.getStorage.storages[0].foodItems) {
                //Find our foodItem
                let index = data.getStorage.storages[0].foodItems.findIndex(food => food.id == foodItem.id);
                foodItems = [...data.getStorage.storages[0].foodItems];
                foodItems.splice(index, 1);
                //Write our change back to the cache
                store.writeFragment({
                  id: "Storage:" + storageId, fragment: gql`
                    # noinspection GraphQLSchemaValidation
                    fragment myStorage on Storage {
                      foodItems
                    }`, data: {foodItems}
                });
              }
            }
          }
        }
      }
    ).pipe(map((result) => {
      if (result.errors) {
        let payload: RemovalPayload = {error: result.errors.join(","), success: 0, id: -1};
        return payload;
      } else if (!result.data?.removeFoodItem) {
        let payload: RemovalPayload = {"error": "An unknown error occurred", success: 0, id: -1};
        return payload;
      } else {
        return result.data.removeFoodItem;
      }
    }));
  }

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
