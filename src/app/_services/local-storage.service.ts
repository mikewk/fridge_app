import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {GetUser_Query, QL_Storage, User} from "../graphql.types";
import {BehaviorSubject, Observer} from "rxjs";
import {Apollo} from "apollo-angular";
import {GetUser_GQL} from "../_graphql-services/user.service";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'user-object';
const USER_TYPE_KEY = 'user-type';
const HOUSEHOLD_KEY = 'selected-household';
const SELECTED_STORAGES_KEY = 'selected-storages';

/**
 * This service helps manage our local storage
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  //This helps track the usertype and update it when the selected household changes.
  private userType: BehaviorSubject<string> =
    new BehaviorSubject<string>(this.initUserType());

  public selectedHouseholdId: BehaviorSubject<number | undefined> =
    new BehaviorSubject<number | undefined>(this.initSelectedHousehold());

  public selectedStorages: BehaviorSubject<QL_Storage[] | undefined> =
    new BehaviorSubject<QL_Storage[] | undefined>(this.getSelectedStorages());

  constructor(private jwtHelper: JwtHelperService,
              private apollo: Apollo) {
  }

  getSelectedHouseholdObservable()
  {
    return this.selectedHouseholdId.asObservable();
  }

  signOut(): void {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }


  private initUserType()
  {
    return window.sessionStorage.getItem(USER_TYPE_KEY)??"";
  }

  /**
   * Public Subscription Interface.  This prevents anyone from getting the old public BehaviorSubject
   * and pushing .next() on it, which caused some bugs
   * @param callBack
   */
  subscribeUsertype(callBack: Function)
  {
    this.userType.subscribe((x)=>callBack(x));
  }

  /**
   * Returns the current usertype
   */
  public getUserType(): string
  {
    return this.userType.getValue();
  }

  /**
   * Public subscription interface.
   * @param callBack
   */
  subscribeSelectedHouseholdId(callBack: Function)
  {
    this.selectedHouseholdId.subscribe((x)=>callBack(x));
  }

  public getSelectedHouseholdId(): number | undefined
  {
    return this.selectedHouseholdId.getValue();
  }

  /**
   * Initialize the selected household, if possible
   */
  private initSelectedHousehold(): number | undefined {
    const householdId = window.sessionStorage.getItem(HOUSEHOLD_KEY);
    if( householdId ) {
      return Number(householdId);
    }
    else {
      return;
    }
    //TODO:  Determine if we need this, AppComponent should be handling this bootstrap now
    /*
    if( householdId ) {
      return Number(householdId);
    }
    else {
      //If we don't have a householdId, check to see if we have a user and default
      const userQuery = this.apollo.client.readQuery<GetUser_Query>({query: GetUser_GQL});

      //If we have a user (we should)
      if( userQuery?.getUser.users?.length == 1 )
      {
        const user = userQuery.getUser.users[0]!;
        //If they have a default household
        if( user.defaultHousehold ) {
          let userType = "member";
          if (user.id == user.defaultHousehold.owner?.id)
            userType = "owner";
          this.switchHousehold(user.defaultHousehold.id, userType);
          return user.defaultHousehold.id;
        }
      }
      return;
    }*/
  }

  /**
   * Change selected household id
   */
  public switchHousehold(householdId: number, userType: string) {
    window.sessionStorage.setItem(HOUSEHOLD_KEY, String(householdId));
    window.sessionStorage.setItem(USER_TYPE_KEY, userType);
    //clear out the selected storages
    window.sessionStorage.removeItem(SELECTED_STORAGES_KEY);
    //update our behavior subjects
    this.userType?.next(userType);
    this.selectedHouseholdId?.next(householdId);
  }

  /**
   * Save the JWT token in local storage
   * @param token
   */
  public saveToken(token: string): void {
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Get the JWT token
   */
  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Save the user and reset Usertype
   * @param userId
   */
  public saveUser(userId: number): void {
    window.localStorage.setItem(USER_KEY, String(userId));
  }

  /**
   * Get the current user id
   */
  public getUser(): number | undefined {
    const data = this.apollo.client.readQuery<GetUser_Query>({query:GetUser_GQL});
    if( data?.getUser?.users) {
      return data.getUser.users[0].id;
    }
    return;
  }

  /**
   * Get the currently selected storages of the household, if any
   */
  public getSelectedStorages(): QL_Storage[] | undefined {
    const storagesString = window.sessionStorage.getItem(SELECTED_STORAGES_KEY);
    if (storagesString) {
      return JSON.parse(storagesString);
    } else {
      return undefined;
    }
  }

  /**
   * Set the currently selected storages of the household, if any
   */
  public setSelectedStorages(storages: QL_Storage[] | undefined) {
    window.sessionStorage.setItem(SELECTED_STORAGES_KEY, JSON.stringify(storages));
    this.selectedStorages.next(storages);
  }

}
