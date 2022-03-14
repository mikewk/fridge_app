/**
 * A set of types based off the GraphQL API schema to help facilitate parsing objects in and out of the API
 */
import {stringify} from "@angular/compiler/src/util";

export type User = {
  id: number
  email: string
  name: string
}

export type QL_Storage = {
  id?: number
  name: string
  type: string
  foodItems?: FoodItem[]
}

export type Household = {
  id: number
  name: string
  location: string
  owner: User
  storages: QL_Storage[]
  users: User[]
}

export type FoodItem = {
  id?: number
  name: string
  storageId?: number
  enteredBy?: User
  entered?: string
  expiration?: string
  tags: string[]
}

export type Suggestion = {
  name: string
  tags: string[]
}

export type AuthPayload = {
  token: string
  error: string
}

export type HouseholdsPayload = {
  households: Household[]
  error: string
}

export type StoragesPayload = {
  storages: QL_Storage[]
  error: string
}

export type UsersPayload = {
  users: User[]
  error: string
}

export type FoodItemsPayload = {
  foodItems?: FoodItem[]
  error?: string
}

export type RemovalPayload = {
  success: number
  error: string
}

export type SuggestionPayload = {
  suggestion: Suggestion
  error: string
}

export type AddFoodItem_Mutation = {
  addFoodItemToStorage: FoodItemsPayload
}

export type GetStorage_Query = {
  getStorage: StoragesPayload
}

export type UpdateFoodItem_Mutation = {
  updateFoodItem: FoodItemsPayload
}

export type RemoveFoodItem_Mutation = {
  removeFoodItem: RemovalPayload
}

export type GetSuggestions_Query = {
  getSuggestions: SuggestionPayload
}
