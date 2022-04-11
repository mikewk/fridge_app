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
import {HOUSEHOLD_CORE, INVITE_FIELDS} from "../graphql.fragments";
import {HouseholdHelperService} from "../cache-helpers/household-helper.service";

const GetInvites_GQL = gql`
  query getInvites($householdId: Int!)
  {
    getInvites(householdId: $householdId)
    {
      error,
      invites {
        ...InviteFields
      }
    }
  }
  ${INVITE_FIELDS}
`

const GetInvite_GQL = gql`
  query getInvite($id: String!) {
    getInvite(inviteId: $id) {
      error,
      invites {
        ...InviteFields
      }
    }
  }
  ${INVITE_FIELDS}
`

const InviteUserToHousehold_GQL = gql`
  mutation inviteUserToHousehold($householdId: Int!, $message: String!) {
    inviteUserToHousehold(householdId: $householdId, message: $message) {
      error,
      invites {
        id, message, status
      }
    }
  }
`

const DeleteInvite_GQL = gql`
  mutation deleteInvite($inviteId: String!) {
    deleteInvite(inviteId: $inviteId) {
      error,
      success
    }
  }
`

const RejectHouseholdInvite_GQL = gql`
  mutation rejectHouseholdInvite($inviteId: String!) {
    rejectHouseholdInvite(inviteId: $inviteId) {
      error,
      success,
      id
    }
  }
`

const AcceptHouseholdInvite_GQL = gql`
  mutation acceptHouseholdInvite($inviteId: String!) {
    acceptHouseholdInvite(inviteId: $inviteId) {
      error,
      households {
        ...HouseholdCore
      }
    }
  },
  ${HOUSEHOLD_CORE}
`

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  constructor(private apollo: Apollo,
              private householdHelper: HouseholdHelperService) { }

  getInvites(householdId: number):Observable<InvitesPayload>
  {
    return this.apollo.watchQuery<GetInvites_Query>({
      query: GetInvites_GQL,
      variables: {
        householdId: householdId
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
      },
      fetchPolicy: "network-only"
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

  deleteInvite(invite: Invite, householdId: number): Observable<RemovalPayload>
  {
    return this.apollo.mutate<DeleteInvite_Mutation>({
      mutation: DeleteInvite_GQL,
        refetchQueries: [
          {
            query: GetInvites_GQL,
            variables: {householdId: householdId}
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

  acceptInvite(invite: Invite, userId: number): Observable<HouseholdsPayload>{
    return this.apollo.mutate<AcceptHouseholdInvite_Mutation>( {
      mutation: AcceptHouseholdInvite_GQL,
      variables: {
        inviteId: invite.id
      },
      update: (store, {data: payload}) => {
        //If we got a household back, we have been invite
        if( payload?.acceptHouseholdInvite.households )
        {
          this.householdHelper.acceptInvite(payload.acceptHouseholdInvite.households[0]);
        }
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
