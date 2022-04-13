import { Injectable } from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {FoodItem, Messages_Payload} from "../graphql.types";
import {ApolloCache} from "@apollo/client/cache";
import {FOOD_ITEM_FIELDS} from "../graphql.fragments";

@Injectable({
  providedIn: 'root'
})
export class FoodItemHelperService {

  store: ApolloCache<any>;

  constructor(private apollo: Apollo) {
    this.store = this.apollo.client.cache;
  }

  /**
   * Do the action in the message using the FoodItem in the message
   * @param message
   */
  doMessage(message: Messages_Payload)
  {
    const foodItem: FoodItem = <FoodItem>message.message;
    switch(message.action)
    {
      case "add":
        this.addFoodItem(foodItem);
        break;
      case "edit":
        this.editFoodItem(foodItem);
        break;
      case "remove":
        this.removeFoodItem(foodItem);
        break;
    }
  }

  /**
   * Add the FoodItem to the storage in the cache
   * @param foodItem
   */
  addFoodItem(foodItem: FoodItem) {
    const storageId = foodItem.storage?.id;
    //Get the current storage from cache
    const data = this.readStorageFromCache(storageId);
    //Make sure we have data in the cache (we bloody should)
    if (data) {
      console.log("Updating cache");
      let foodItems;
      //If we have a food items array, spread it and add our new one to the end
      if (data.foodItems)
        foodItems = [...data.foodItems, foodItem];
      //Otherwise, we'll just make one
      else
        foodItems = [foodItem];

      //Write our change back to the cache
      this.writeStorageToCache(storageId, foodItems)
    }
  }

  /**
   * Update the FoodItem with the new fields in the cache
   * @param foodItem
   */
  editFoodItem(foodItem: FoodItem)
  {
    //Write our change back to the cache
    this.store.writeFragment({
      id: "FoodItem:" + foodItem.id, fragment: gql`
        fragment myItem on FoodItem {
          name,
          tags,
          expiration
        }`, data: {name: foodItem.name, tags: foodItem.tags, expiration: foodItem.expiration}
    });
  }

  /**
   * Remove the FoodItem from its storage
   * @param foodItem
   */
  removeFoodItem(foodItem: FoodItem)
  {
    //Write our change back to the cache
    //First we need to remove the item from the storage
    const storageId = foodItem.storage?.id;
    //Get the current storage from cache
    const data = this.readStorageFromCache(storageId)
    //If we have a food items array, get it and remove our food item
    //If we don't have a food item array anymore... something something race condition we'll just do nothing
    if (data.foodItems) {

      //Find our foodItem
      let index = data.foodItems.findIndex((food: { id: number | undefined; })=> food.id == foodItem.id);
      let foodItems = [...data.foodItems];
      foodItems.splice(index, 1);
      //Write our change back to the cache
      this.writeStorageToCache(storageId, foodItems);
    }
  }

  /**
   * Writes the FoodItem array to the storage in the cache
   * @param storageId
   * @param foodItems
   * @private
   */
  private writeStorageToCache(storageId: number | undefined, foodItems: any[]) {
    this.store.writeFragment({
      id: "Storage:" + storageId, fragment: gql`
        # noinspection GraphQLSchemaValidation
        fragment myStorage on Storage {
          foodItems
        }`, data: {foodItems}
    });
  }

  /**
   * Read a FoodItem array for the storage from the cache
   * @param storageId
   * @private
   */
  private readStorageFromCache(storageId: number | undefined) {
    return this.store.readFragment<any>({
      id: "Storage:" + storageId,
      fragment: gql`
        fragment MyStorage on Storage {
          foodItems {
            ...FoodItemFields
          }
        }
        ${FOOD_ITEM_FIELDS}
      `, fragmentName: "MyStorage"
    });
  }
}
