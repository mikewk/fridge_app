import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {HouseholdService} from "../_graphql-services/household.service";
import {LocalStorageService} from "../_services/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class OwnerGuard implements CanActivate {

  constructor(private householdService: HouseholdService,
              private localStorage: LocalStorageService,
              private router: Router) {

  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if( this.localStorage.getUserType() == 'owner') {
      return true;
    }
    else {
      this.router.navigate(["dashboard"]);
      return false;
    }
  }

}
