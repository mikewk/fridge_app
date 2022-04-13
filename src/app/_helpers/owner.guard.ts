import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {LocalStorageService} from "../_services/local-storage.service";

/**
 * Guards pages that require the user to be the owner of the currently selected houehold.
 */
@Injectable({
  providedIn: 'root'
})
export class OwnerGuard implements CanActivate {

  constructor(private localStorage: LocalStorageService,
              private router: Router) {

  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    //The work for this guard has been moved to the LocalStorageService
    if( this.localStorage.getUserType() == 'owner') {
      return true;
    }
    else {
      //If they aren't the owner, go to the dashboard
      this.router.navigate(["dashboard"]);
      return false;
    }
  }

}
