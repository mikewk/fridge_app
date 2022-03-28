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
