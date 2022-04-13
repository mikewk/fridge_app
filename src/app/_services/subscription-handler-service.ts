import {Apollo, gql} from "apollo-angular";
import {map} from "rxjs";
import {FOOD_ITEM_FIELDS, HOUSEHOLD_CORE} from "../graphql.fragments";
import {Messages_Subscription} from "../graphql.types";
import {FoodItemHelperService} from "../cache-helpers/food-item-helper.service";
import {Injectable} from "@angular/core";
import {StorageHelperService} from "../cache-helpers/storage-helper.service";
import {HouseholdHelperService} from "../cache-helpers/household-helper.service";


const MESSAGES_GQL = gql`
  subscription messages($sourceId: String, $token: String)
  {
    messages(source_id: $sourceId, token: $token)
    {
      type, action, message {
        ... on FoodItem{
          ...FoodItemFields
          }
        ... on Storage {
          id, name, type, householdId
        }
        ... on Household {
          ...HouseholdCore
        }
        ... on AuthPayload{
          token, error
        }
      }
    }
  }
  ${FOOD_ITEM_FIELDS}
  ${HOUSEHOLD_CORE},
`

/**
 * Handles messages coming in from Websocket subscription
 */
@Injectable({
  providedIn: 'root'
})
export class SubscriptionHandlerService {

  constructor(private apollo: Apollo,
              private foodItemHelper: FoodItemHelperService,
              private storageHelper: StorageHelperService,
              private householdHelper: HouseholdHelperService)
  {

  }

  /**
   * Initialize the subscription with the token and source_id
   * We need to send these to the subscription because they can't be sent in the headers
   * @param sourceId
   * @param token
   */
  initSubscription(sourceId:string, token:string) {
    this.apollo.subscribe<Messages_Subscription>({
      query: MESSAGES_GQL,
      variables: {
        sourceId: sourceId,
        token: token
      }
    }).pipe(map((result) => {
      //Standardizes error and payload return
      if (result.errors) {
        return {type: "error", action: result.errors.join("\n"), message: undefined};
      } else if (!result.data?.messages) {
        return {type: "error", action: "unknown error", message: undefined};
      } else {
        return result.data.messages;
      }
    })).subscribe((data) => {
      // Process the incoming messages based on data type
      switch (data.type) {
        case "error":
          console.log(data.action);
          break;
        case "FoodItem":
          this.foodItemHelper.doMessage(data);
          break;
        case "Storage":
          this.storageHelper.doMessage(data);
          break;
        case "Household":
          this.householdHelper.doMessage(data);
          break;
        case "AuthPayload":
          console.log(data.message);
          break;
        case "Invite":
          console.log(data.message);
          break;
      }
    })
  }
}
