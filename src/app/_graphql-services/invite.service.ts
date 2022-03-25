import { Injectable } from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {map, Observable} from "rxjs";
import {
  AcceptHouseholdInvite_Mutation,
  DeleteInvite_Mutation, GetInvite_Query,
  GetInvites_Query,
  Household, HouseholdsPayload,
  Invite,
  InvitesPayload,
  InviteUserToHousehold_Mutation, RejectHouseholdInvite_Mutation,
  RemovalPayload
} from "../graphql.types";

const GetInvites_GQL = gql`
  query getInvites($householdId: Int!)
  {
    getInvites(householdId: $householdId)
    {
      error,
      invites {
        id, householdName, inviteeName, message, status
      }
    }
  }
`

const GetInvite_GQL = gql`
    query getInvite($id: String!)
    {
      getInvite(inviteId: $id)
      {
        error,
        invites {
          id, householdName, message, status, inviterName
        }
      }
    }
`

const InviteUserToHousehold_GQL = gql`
    mutation inviteUserToHousehold($householdId: Int!, $message: String!)
    {
      inviteUserToHousehold(householdId: $householdId, message: $message)
      {
        error,
        invites
        {
          id, message, status
        }
      }
    }
`

const DeleteInvite_GQL = gql`
    mutation deleteInvite($inviteId: String!)
    {
      deleteInvite(inviteId: $inviteId)
      {
        error,
        success
      }
    }
`

const RejectHouseholdInvite_GQL = gql`
    mutation rejectHouseholdInvite($inviteId: String!)
    {
      rejectHouseholdInvite(inviteId: $inviteId)
      {
        error,
        success,
        id
      }
    }
`

const AcceptHouseholdInvite_GQL = gql`
    mutation acceptHouseholdInvite($inviteId: String!)
    {
      acceptHouseholdInvite(inviteId: $inviteId)
      {
        error,
        households {
          id, name, location, owner {
            id, name
          },
          users {
            id, name
          },
          storages {
            name, type, foodItems {
              name
            }
          }
        }
      }
    }
`

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  constructor(private apollo: Apollo) { }

  getInvites(household: Household):Observable<InvitesPayload>
  {
    return this.apollo.watchQuery<GetInvites_Query>({
      query: GetInvites_GQL,
      variables: {
        householdId: household.id
      }
    }).valueChanges.pipe(map((result) => {
      if (result.errors) {
        return {error: result.errors.join(",")};
      } else if (!result.data?.getInvites) {
        return {error: "An unknown error occurred"};
      } else {
        return result.data.getInvites;
      }
    }));
  }

  getInvite(id: string):Observable<InvitesPayload>
  {
    return this.apollo.watchQuery<GetInvite_Query>({
      query: GetInvite_GQL,
      variables: {
        id: id
      }
    }).valueChanges.pipe(map((result) => {
      if (result.errors) {
        return {error: result.errors.join(",")};
      } else if (!result.data?.getInvite) {
        return {error: "An unknown error occurred"};
      } else {
        return result.data.getInvite;
      }
    }));
  }

  createInvite(invite: Invite, household:Household): Observable<InvitesPayload> {
    return this.apollo.mutate<InviteUserToHousehold_Mutation>({
        mutation: InviteUserToHousehold_GQL,
        refetchQueries: [
          {
            query: GetInvites_GQL,
            variables: {householdId: household.id}
          }
        ],
        variables:
          {
            householdId: household.id,
            message: invite.message
          }
    }).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(",")};
      } else if (!result.data?.inviteUserToHousehold) {
        return {error: "An unknown error occurred"};
      } else {
        return result.data.inviteUserToHousehold;
      }
    }));
  }

  deleteInvite(invite: Invite, household: Household): Observable<RemovalPayload>
  {
    return this.apollo.mutate<DeleteInvite_Mutation>({
      mutation: DeleteInvite_GQL,
        refetchQueries: [
          {
            query: GetInvites_GQL,
            variables: {householdId: household.id}
          }
        ],
        variables:
          {
            inviteId:invite.id
          }
    }).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(","), success:0, id:-1};
      } else if (!result.data?.deleteInvite) {
        return {error: "An unknown error occurred", success:0, id:-1};
      } else {
        return result.data.deleteInvite;
      }
    }));
  }

  rejectInvite(invite: Invite): Observable<RemovalPayload> {
    return this.apollo.mutate<RejectHouseholdInvite_Mutation>( {
      mutation: RejectHouseholdInvite_GQL,
      variables: {
        inviteId: invite.id
      }
    }).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(","), success:0, id:-1};
      } else if (!result.data?.rejectHouseholdInvite) {
        return {error: "An unknown error occurred", success:0, id:-1};
      } else {
        return result.data.rejectHouseholdInvite;
      }
    }));
  }

  acceptInvite(invite: Invite): Observable<HouseholdsPayload>{
    return this.apollo.mutate<AcceptHouseholdInvite_Mutation>( {
      mutation: AcceptHouseholdInvite_GQL,
      variables: {
        inviteId: invite.id
      }
    }).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {error: result.errors.join(","), success:0, id:-1};
      } else if (!result.data?.acceptHouseholdInvite) {
        return {error: "An unknown error occurred", success:0, id:-1};
      } else {
        return result.data.acceptHouseholdInvite;
      }
    }));

  }
}
