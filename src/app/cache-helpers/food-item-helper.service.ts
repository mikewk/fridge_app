import { Injectable } from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {FoodItem, Messages_Payload} from "../graphql.types";

@Injectable({
  providedIn: 'root'
})
export class FoodItemHelperService {


  constructor(private apollo: Apollo) {

  }

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

  addFoodItem(foodItem: FoodItem) {
    const store = this.apollo.client.cache;
    const storageId = foodItem.storage?.id;
    //Get the current storage from cache
    const data = store.readFragment<any>({
      id: "Storage:" + storageId,
      fragment: gql`
        fragment MyStorage on Storage
        {
          foodItems {
            id, name, filename, tags, storage {
              id, name, type
            }
          }
        }
      `
    })
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
      store.writeFragment({
        id: "Storage:" + storageId, fragment: gql`
          # noinspection GraphQLSchemaValidation
          fragment myStorage on Storage {
            foodItems
          }`, data: {foodItems}
      });
    }
  }

  editFoodItem(foodItem: FoodItem)
  {
    //Write our change back to the cache
    const store = this.apollo.client.cache;
    store.writeFragment({
      id: "FoodItem:" + foodItem.id, fragment: gql`
        fragment myItem on FoodItem {
          name,
          tags,
          expiration
        }`, data: {name: foodItem.name, tags: foodItem.tags, expiration: foodItem.expiration}
    });
  }

  removeFoodItem(foodItem: FoodItem)
  {
    const store = this.apollo.client.cache;
    //Write our change back to the cache
    //First we need to remove the item from the storage
    const storageId = foodItem.storage?.id;
    //Get the current storage from cache
    const data = store.readFragment<any>({
      id: "Storage:"+storageId,
      fragment: gql`
        fragment MyStorage on Storage
        {
          foodItems {
            id, name, filename, tags, storage {
                id, name, type
              }
          }
        }
      `
    })
    //If we have a food items array, get it and remove our food item
    //If we don't have a food item array anymore... something something race condition we'll just do nothing
    if (data.foodItems) {

      //Find our foodItem
      let index = data.foodItems.findIndex((food: { id: number | undefined; })=> food.id == foodItem.id);
      let foodItems = [...data.foodItems];
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
