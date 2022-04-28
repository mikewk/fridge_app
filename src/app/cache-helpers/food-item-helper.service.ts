import { Injectable } from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {FoodItem, Messages_Payload} from "../graphql.types";
import {ApolloCache} from "@apollo/client/cache";
import {FOOD_ITEM_FIELDS} from "../graphql.fragments";

/**
 * Helper class for FoodItem subscription messages
 */
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
    const cache = this.store;  // Create a reference that can be used inside the modify function

    // use cache.modify to update the storage with our new food item
    cache.modify({
        id: "Storage:" + storageId,
        fields: {
          foodItems(existingFoodItemRefs = []) {
            // Get the cache reference to the FoodItem that was just added
            const newFoodItemRef = cache.writeFragment({
              data: foodItem,
              fragment: gql`
                fragment ThisFoodItem on FoodItem {
                  id
                }
              `
            });
            // return the new array with this FoodItem added
            return [...existingFoodItemRefs, newFoodItemRef];
          }
        }
      }
    );
  }

  /**
   * Update the FoodItem with the new fields in the cache
   * @param foodItem
   */
  editFoodItem(foodItem: FoodItem)
  {
    /*Write our change back to the cache
    this.store.writeFragment({
      id: "FoodItem:" + foodItem.id, fragment: gql`
        fragment myItem on FoodItem {
          name,
          tags,
          expiration
        }`, data: {name: foodItem.name, tags: foodItem.tags, expiration: foodItem.expiration}
    });*/
  }

  /**
   * Remove the FoodItem from its storage
   * @param foodItem
   */
  removeFoodItem(foodItem: FoodItem)
  {
    const cache = this.store; // Create a reference that can be used inside the modify function
    // Use cache.modify to remove just the reference from the FoodItems array
    cache.modify({
        id: "Storage:" + foodItem.storage?.id,
        fields: {
          foodItems(existingFoodItemRefs = [], {readField} ) {
            return existingFoodItemRefs.filter( (x:any)=>foodItem.id!=readField('id', x));
          }
        }
      }
    );
    //clean up the cache
    cache.gc();

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
        }`, data: {foodItems: foodItems}
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
