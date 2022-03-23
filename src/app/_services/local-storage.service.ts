import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {Household, User} from "../graphql.types";
import {BehaviorSubject} from "rxjs";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'user-object';
const HOUSEHOLD_KEY = 'selected-household'

/**
 * This service helps manage the JWT authentication token in local storage
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public userType: BehaviorSubject<string> = new BehaviorSubject<string>(this.getUserType());

  constructor(private jwtHelper: JwtHelperService) {
  }


  signOut(): void {
    window.sessionStorage.clear();
  }

  public getUserType(): string
  {
    const user = this.getUser();
    const household = this.getHousehold();
    if(user?.ownedHouseholds.filter(x=>x.id==household?.id).length == 1) {
      return "owner";
    } else if(user?.memberHouseholds.filter(x=>x.id==household?.id).length == 1) {
      return "member";
    }
    else {
      return "";
    }

  }

  public getHousehold(): Household | undefined {
    const household = window.sessionStorage.getItem(HOUSEHOLD_KEY);
    if (household) {
      return JSON.parse(household);
    }
    return;
  }

  public saveHousehold(household: Household) {
    window.sessionStorage.removeItem(HOUSEHOLD_KEY);
    window.sessionStorage.setItem(HOUSEHOLD_KEY, JSON.stringify(household));

    //update usertype
    this.userType.next(this.getUserType());

  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: User): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    //update usertype
    this.userType.next(this.getUserType());
  }

  public getUser(): User | null {
    const userString = window.sessionStorage.getItem(USER_KEY);
    if (userString) {
      return JSON.parse(userString);
    } else {
      return null;
    }
  }

}
