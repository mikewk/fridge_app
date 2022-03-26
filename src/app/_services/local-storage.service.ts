import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {Household, QL_Storage, User} from "../graphql.types";
import {BehaviorSubject} from "rxjs";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'user-object';
const HOUSEHOLD_KEY = 'selected-household'
const SELECTED_STORAGES_KEY = 'selected-storages';

/**
 * This service helps manage our local storage
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  //This helps track the usertype and update it when the selected household changes.
  public userType: BehaviorSubject<string> = new BehaviorSubject<string>(this.getUserType());
  public household: BehaviorSubject<Household | undefined> = new BehaviorSubject<Household | undefined>(this.getHousehold());

  constructor(private jwtHelper: JwtHelperService) {
  }


  signOut(): void {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  /**
   * Returns the current usertype
   */
  public getUserType(): string
  {
    //Get our user and household
    const user = this.getUser();
    const household = this.getHousehold();
    //If the selected household ID is in OwnedHouseholds return owner
    if(user?.ownedHouseholds.filter(x=>x.id==household?.id).length == 1) {
      return "owner";
      //Otherwise, if it's in member households, they're a member
    } else if(user?.memberHouseholds.filter(x=>x.id==household?.id).length == 1) {
      return "member";
    }
    else {
      //This should never happen unless they have no households at all
      return "";
    }
  }

  /**
   * Get the stored 'selected' household
   */
  public getHousehold(): Household | undefined {
    const household = window.sessionStorage.getItem(HOUSEHOLD_KEY);
    if (household) {
      return JSON.parse(household);
    }
    else
    {
      //if we don't have a selected, check localstorage for a default
      const defaultHousehold = this.getUser()?.defaultHousehold;
      if( defaultHousehold )
      {
        //When we're bootstrapping from a fresh tab, this causes a little minor recursion
        this.saveHousehold(defaultHousehold);
        return defaultHousehold;
      }
      else
        return;
    }
  }

  /**
   * Save a household as selected
   */
  public saveHousehold(household: Household) {
    window.sessionStorage.setItem(HOUSEHOLD_KEY, JSON.stringify(household));
    //clear out the selected storages
    window.sessionStorage.removeItem(SELECTED_STORAGES_KEY);

    //update usertype but only if it's not null
    if( this.userType )
      this.userType.next(this.getUserType());
    this.household.next(household);

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
    //update usertype
    this.userType.next(this.getUserType());
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
  }

}
