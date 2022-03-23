/**
 * A set of types based off the GraphQL API schema to help facilitate parsing objects in and out of the API
 */

export type User = {
  id: number
  email: string
  name: string
  defaultHousehold?: Household
  memberHouseholds: Household[]
  ownedHouseholds: Household[]
}

export type QL_Storage = {
  id?: number
  name: string
  type: string
  foodItems?: FoodItem[]
}

export type Household = {
  id?: number
  name: string
  location: string
  folder?: string
  owner?: User
  storages?: QL_Storage[]
  users?: User[]
}

export type FoodItem = {
  id?: number
  name: string
  storage?: QL_Storage
  enteredBy?: User
  entered?: string
  expiration?: string
  filename?: string
  tags: string[]
}

export type Suggestion = {
  filename: string
  name: string
  tags: string[]
}

export type AuthPayload = {
  token: string
  error: string
  user?: User
}

export type HouseholdsPayload = {
  households?: Household[]
  error: string
}

export type StoragesPayload = {
  storages?: QL_Storage[]
  error: string
}

export type UsersPayload = {
  users?: User[]
  error: string
}

export type FoodItemsPayload = {
  foodItems?: FoodItem[]
  error?: string
}

export type RemovalPayload = {
  id: number
  success: number
  error: string
}

export type SuggestionPayload = {
  suggestion?: Suggestion
  error: string
}

export type GetStorage_Query = {
  getStorage: StoragesPayload
}

export type GetHousehold_Query = {
  getHousehold: HouseholdsPayload
}

export type GetMemberHouseholds_Query =
  {
    getMemberHouseholds: HouseholdsPayload;
  }

export type AddHousehold_Mutation =
  {
    createHousehold: HouseholdsPayload;
  }

export type UpdateFoodItem_Mutation = {
  updateFoodItem: FoodItemsPayload
}

export type RemoveFoodItem_Mutation = {
  removeFoodItem: RemovalPayload
}

export type GetSuggestions_Mutation = {
  getSuggestions: SuggestionPayload
}

export type Login_Mutation = {
  login: AuthPayload
}

export type Signup_Mutation = {
  signup: AuthPayload
}

export type AddFoodItem_Mutation = {
  addFoodItemToStorage: FoodItemsPayload
}

export type AddStorageToHousehold_Mutation = {
  addStorageToHousehold: HouseholdsPayload;
}

export type ChangeDefaultHousehold_Mutation = {
  changeDefaultHousehold: UsersPayload
}

export type RemoveStorage_Mutation = {
  removeStorage: RemovalPayload
}

