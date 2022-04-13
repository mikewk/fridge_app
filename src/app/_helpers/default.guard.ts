import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {LocalStorageService} from "../_services/local-storage.service";

/**
 * This guard checks to see if we have a household selected to view
 */
@Injectable({
  providedIn: 'root'
})
export class DefaultGuard implements CanActivate {

  constructor(private localStorage: LocalStorageService,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    //Get household from local storage
    const household = this.localStorage.getSelectedHouseholdId();
    //If it exists, return true
    if (household) {
      return true;
    } else {
      //Otherwise, go to the welcome page
      this.router.navigate(["welcome"]);
      return false;
    }
  }

}
