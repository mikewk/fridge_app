import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {Household, User} from "../graphql.types";
import {BehaviorSubject} from "rxjs";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'user-object';
const HOUSEHOLD_KEY = 'selected-household'

/**
 * This service helps manage our local storage
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  //This helps track the usertype and update it when the selected household changes.
  public userType: BehaviorSubject<string> = new BehaviorSubject<string>(this.getUserType());

  constructor(private jwtHelper: JwtHelperService) {
  }


  signOut(): void {
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
    return;
  }

  /**
   * Save a household as selected
   */
  public saveHousehold(household: Household) {
    window.sessionStorage.removeItem(HOUSEHOLD_KEY);
    window.sessionStorage.setItem(HOUSEHOLD_KEY, JSON.stringify(household));

    //update usertype
    this.userType.next(this.getUserType());

  }

  /**
   * Save the JWT token in local storage
   * @param token
   */
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Get the JWT token
   */
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   * Save the user and reset Usertype
   * @param user
   */
  public saveUser(user: User): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    //update usertype
    this.userType.next(this.getUserType());
  }

  /**
   * Get the current user
   */
  public getUser(): User | null {
    const userString = window.sessionStorage.getItem(USER_KEY);
    if (userString) {
      return JSON.parse(userString);
    } else {
      return null;
    }
  }

}
