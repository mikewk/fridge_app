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
  householdId?: number
  foodItems?: FoodItem[]
}

export type Household = {
  id: number
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

export type Invite = {
  id: string
  householdName: string
  message: string
  status: number
  inviteeName: string
  inviterName: string
}

export type InvitesPayload = {
  invites?: [Invite]
  error: string
}

export type AuthPayload = {
  token: string
  error: string
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

export type Messages_Payload = {
  type: String
  action: String
  message: AuthPayload | FoodItem | Household | QL_Storage | undefined
}

export type GetInvites_Query = {
  getInvites: InvitesPayload
}

export type GetStorage_Query = {
  getStorage: StoragesPayload
}

export type GetHousehold_Query = {
  getHousehold: HouseholdsPayload
}

export type GetInvite_Query = {
  getInvite: InvitesPayload
}

export type GetMemberHouseholds_Query =
  {
    getMemberHouseholds: HouseholdsPayload;
  }

export type GetUser_Query = {
  getUser: UsersPayload;
}

export type CreateHousehold_Mutation =
  {
    createHousehold: HouseholdsPayload;
  }

export type EditFoodItem_Mutation = {
  editFoodItem: FoodItemsPayload
}

export type DeleteFoodItem_Mutation = {
  deleteFoodItem: RemovalPayload
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
  addStorageToHousehold: StoragesPayload
}

export type ChangeDefaultHousehold_Mutation = {
  changeDefaultHousehold: HouseholdsPayload
}

export type DeleteStorage_Mutation = {
  deleteStorage: RemovalPayload
}

export type EditStorage_Mutation = {
  editStorage: StoragesPayload
}

export type EditHousehold_Mutation = {
  editHousehold: HouseholdsPayload
}

export type InviteUserToHousehold_Mutation = {
  inviteUserToHousehold: InvitesPayload
}

export type DeleteInvite_Mutation = {
  deleteInvite: RemovalPayload
}

export type RejectHouseholdInvite_Mutation = {
  rejectHouseholdInvite: RemovalPayload
}

export type AcceptHouseholdInvite_Mutation = {
  acceptHouseholdInvite: HouseholdsPayload
}

export type RefreshToken_Mutation = {
  refreshToken: AuthPayload
}

export type LeaveHousehold_Mutation = {
  leaveHousehold: RemovalPayload
}

export type RemoveUserFromHousehold_Mutation = {
  removeUserFromHousehold: RemovalPayload
}

export type DeleteHousehold_Mutation = {
  deleteHousehold: RemovalPayload
}

export type SendPasswordReset_Mutation = {
  sendPasswordReset: string
}

export type TryPasswordReset_Mutation = {
  tryPasswordReset: string
}

export type EditPassword_Mutation = {
  editPassword: AuthPayload
}

export type EditUsername_Mutation = {
  editUsername: AuthPayload
}

export type Messages_Subscription = {
  messages: Messages_Payload;
}
