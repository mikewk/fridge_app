import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {Household, User} from "../graphql.types";

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
  constructor(private jwtHelper: JwtHelperService) {
  }

  signOut(): void {
    window.sessionStorage.clear();
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
