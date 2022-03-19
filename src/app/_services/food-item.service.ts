import {Injectable} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {
  AddFoodItem_Mutation, FoodItem, GetStorage_Query, GetSuggestions_Mutation,
  RemoveFoodItem_Mutation, StoragesPayload, SuggestionPayload, UpdateFoodItem_Mutation
} from "../graphql.types";
import {delay, map, Observable} from "rxjs";
import {GetStorage} from "./storage.service";

//GraphQL Queries
export const AddFoodItem = gql`
  mutation addFoodItem($storageId: Int!, $name: String!, $tags:[String], $filename:String) {
    addFoodItemToStorage(name: $name, storageId: $storageId, tags: $tags, filename:$filename)
    {
      foodItems
      {id, name, storageName, enteredBy {name}, tags, filename}
      error
    }
  }
`

export const UpdateFoodItem=gql`
  mutation updateFoodItem($foodItemId: Int!, $name: String!, $tags:[String], $expiration: String) {
    updateFoodItem(foodItemId: $foodItemId, name: $name, expiration: $expiration, tags: $tags)
    {
      foodItems {id, name, storageName, enteredBy {name}, tags, expiration},
      error
    }
  }
`

export const RemoveFoodItem=gql`
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
  addFoodItem(storageId: number, foodItem: FoodItem): Observable<any> {
    return this.apollo.mutate<AddFoodItem_Mutation>(
      {
        mutation: AddFoodItem,
        // TODO: Store storageId in fileitem before calling function, so variable can just be fooditem
        variables: {
            storageId: storageId,
            name: foodItem.name,
            tags: foodItem.tags,
            filename: foodItem.filename
          },
        update: (store, {data: payload})=> {
          if( payload && payload.addFoodItemToStorage.foodItems )
          {
            //Get the current storage from cache
            const data = store.readQuery<GetStorage_Query>({query: GetStorage, variables: {storageId: storageId}});

            //Make sure we have data in the cache (we bloody should)
            if( data )
            {
              console.log("Updating cache");
              let foodItems;
              //If we have a food items array, spread it and add our new one to the end
              if( data.getStorage.storages[0].foodItems)
                foodItems = [...data.getStorage.storages[0].foodItems, payload.addFoodItemToStorage.foodItems[0]];
              //Otherwise, let's just use our array from the return payload
              else
                foodItems = payload.addFoodItemToStorage.foodItems;

              //Write our change back to the cache
              store.writeFragment({id: "Storage:"+storageId, fragment: gql`
                  # noinspection GraphQLSchemaValidation
                  fragment myStorage on Storage {
                    foodItems
                  }`,data:{foodItems}});

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
        variables: {
            foodItemId: foodItem.id,
            name: foodItem.name,
            tags: foodItem.tags,
            expiration: foodItem.expiration
          },
        update: (store, {data: payload})=> {
          if( payload && payload.updateFoodItem.foodItems )
          {
            //Write our change back to the cache
            let foodItem = payload.updateFoodItem.foodItems[0];
            store.writeFragment({id: "FoodItem:"+foodItem.id, fragment: gql`
            fragment myItem on FoodItem {
              name,
              tags,
              expiration
              }`,data:{name:foodItem.name, tags:foodItem.tags, expiration: foodItem.expiration}});
          }
        }
      }
    ).pipe(map((result) => result.data));
  }

  removeFoodItem(foodItem: FoodItem): Observable<any> {
    return this.apollo.mutate<RemoveFoodItem_Mutation>(
      {
        mutation: RemoveFoodItem,
        variables: {
            foodItemId: foodItem.id
          },
        update: (store, {data: payload})=> {
          if( payload && payload.removeFoodItem.success)
          {
            //Write our change back to the cache
            //First we need to remove the item from the storage
            let storageId = payload.removeFoodItem.id;
            let data = store.readQuery<GetStorage_Query>({query: GetStorage, variables: {storageId: storageId}});
            let foodItems: FoodItem[];
            //If we have a food items array, get it and remove our food item
            //If we don't have a food item array anymore... something something race condition we'll just do nothing
            if( data ) {
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
    ).pipe(map((result) => result.data));
  }

  getSuggestions(image: string | undefined) {
    return this.apollo.mutate<GetSuggestions_Mutation>(
      {
        mutation: GetSuggestions,
        variables:
          {
            image: image
          }
      }
    ).pipe(map((result) => result.data));
  }
}
