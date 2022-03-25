import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {LocalStorageService} from "../_services/local-storage.service";

/**
 * Guards pages that require an authorized token
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenStorage: LocalStorageService, private router: Router) {
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
      this.router.navigate(["/login"], {queryParams: {returnUrl: state.url}});
      return false;
    }
  }

}
