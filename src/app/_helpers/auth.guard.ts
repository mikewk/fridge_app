import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {TokenStorageService} from "../_services/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenStorage: TokenStorageService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.tokenStorage.getToken()) {
      //If there's a token, assume we're logged in:
      //TODO: Add JWT check here to ensure token isn't expired
      //TODO: Figure out token refresh as well
      return true;
    } else {
      this.router.navigate(["/login"], {queryParams: {returnURL: state.url}});
      return false;
    }
  }

}
