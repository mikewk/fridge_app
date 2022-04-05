import {gql} from "apollo-angular";


export const HOUSEHOLD_CORE = gql`
  fragment HouseholdCore on Household {
    id,
    name,
    location,
    owner {id, name},
    storages {
      id, name, type
    }
  }
`

export const USER_FIELDS = gql`
fragment UserFields on User {
    id,
    name,
    defaultHousehold {
      ...HouseholdCore
    },
    memberHouseholds {
      ...HouseholdCore
    },
    ownedHouseholds {
      id, name, location
    }
  },
  ${HOUSEHOLD_CORE}
`

export const INVITE_FIELDS = gql`
  fragment InviteFields on Invite{
    id, householdName, inviteeName, message, status
  }
`

export const READ_MY_USER = gql`
  fragment ReadMyUser on User {
    id,
    memberHouseholds {
      ...HouseholdCore
    },
    ownedHouseholds {
      id, name, location
    }
  },
  ${HOUSEHOLD_CORE}
`

export const FOOD_ITEM_FIELDS = gql `
  fragment FoodItemFields on FoodItem{
    id, filename, name, expiration, entered,  enteredBy {id, name}, storage { id, name, type }
  }
`

export const STORAGE_FIELDS = gql `
  fragment StorageFields on Storage {
    id, name, type, householdId, foodItems {id, name, tags, storage {id, name, type}, filename}
  }
`
