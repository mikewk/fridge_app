import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {Household, QL_Storage, User} from "../graphql.types";
import {BehaviorSubject} from "rxjs";

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
  public userType: BehaviorSubject<string> =
    new BehaviorSubject<string>(this.getUserType());

  public selectedHouseholdId: BehaviorSubject<number | undefined> =
    new BehaviorSubject<number | undefined>(this.getHouseholdId());

  public selectedStorages: BehaviorSubject<QL_Storage[] | undefined> =
    new BehaviorSubject<QL_Storage[] | undefined>(this.getSelectedStorages());

  constructor(private jwtHelper: JwtHelperService) {
  }


  signOut(): void {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  /**
   * Returns the current usertype
   */
  private getUserType(): string
  {
    return window.sessionStorage.getItem(USER_TYPE_KEY)??"";
  }

  /**
   * Get the stored 'selected' household
   */
  public getHouseholdId(): number | undefined {
    const householdId = window.sessionStorage.getItem(HOUSEHOLD_KEY);
    if( householdId ) {
      return Number(householdId);
    }
    else {
      //If we don't have a householdId, check to see if we have a user and default
      const user = this.getUser();
      if( user && user.defaultHousehold?.id)
      {
        let userType = "member";
        if( user.id == user.defaultHousehold.owner!.id)
          userType = "owner";
        this.switchHousehold(user.defaultHousehold.id, userType);
        return user.defaultHousehold.id;
      }
      return;
    }
  }

  /**
   * Change selected household Id
   */
  public switchHousehold(householdId: number, userType: string) {
    window.sessionStorage.setItem(HOUSEHOLD_KEY, String(householdId));
    window.sessionStorage.setItem(USER_TYPE_KEY, userType);
    //clear out the selected storages
    window.sessionStorage.removeItem(SELECTED_STORAGES_KEY);
    //update our behavior subjects
    this.userType?.next(this.getUserType());
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
   * @param user
   */
  public saveUser(user: User): void {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Get the current user
   */
  public getUser(): User | undefined {
    const userString = window.localStorage.getItem(USER_KEY);
    if (userString) {
      return JSON.parse(userString);
    } else {
      return undefined;
    }
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
