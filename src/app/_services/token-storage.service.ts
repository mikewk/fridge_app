import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";

const TOKEN_KEY = 'auth-token';

/**
 * This service helps manage the JWT authentication token in local storage
 */
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(private jwtHelper: JwtHelperService) {
  }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   * Decode the JWT token in an object, if it exists
   */
  public getUser(): any {
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      return this.jwtHelper.decodeToken(token);
    }

    return {};
  }
}
