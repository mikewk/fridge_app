import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {LocalStorageService} from "../_services/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class DefaultGuard implements CanActivate {

  constructor(private localStorageService: LocalStorageService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const household = this.localStorageService.getHousehold();
    if (household) {
      return true;
    } else {
      this.router.navigate(["welcome"]);
      return false;
    }
  }

}
