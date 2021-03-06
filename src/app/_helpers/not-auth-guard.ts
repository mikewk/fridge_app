import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthGuard} from "./auth.guard";

/**
 * Only allows access if AuthGuard says we're not logged in
 */
@Injectable({
  providedIn: 'root'
})
export class NotAuthGuard implements CanActivate {

  constructor(private authGuard: AuthGuard, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let authResult = this.authGuard.canActivate(route, state);
    if( authResult instanceof UrlTree) {
      return true;
    }
    else {
      return this.router.parseUrl("/dashboard");
    }
  }
}
