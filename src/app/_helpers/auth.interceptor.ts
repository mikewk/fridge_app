import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {LocalStorageService} from '../_services/local-storage.service';
import {Observable} from 'rxjs';

const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end
//const TOKEN_HEADER_KEY = 'x-access-token';   // for Node.js Express back-end
const SOURCE_ID_KEY = 'SourceID'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: LocalStorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.token.getToken(); // Get our possible JWT token
    const uuid = this.token.uuid;

    //If we have a token, add it to the request
    if (token != null) {
      authReq = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token).set(SOURCE_ID_KEY, uuid)});
    }
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];
