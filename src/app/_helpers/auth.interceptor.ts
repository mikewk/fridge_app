import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {LocalStorageService} from '../_services/local-storage.service';
import {Observable} from 'rxjs';

const TOKEN_HEADER_KEY = 'Authorization';
const SOURCE_ID_KEY = 'SourceID'

/**
 * Intercepts HTTP requests and puts in the Authorization and Source_ID headers
 * Authorization is used for API calls and AWS images
 * Source_ID is used for Websocket messages
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private localStorage: LocalStorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.localStorage.getToken(); // Get our possible JWT token
    const uuid = this.localStorage.uuid;  //Get our source_id

    //If we have a token, add it to the request
    //Also add the source_id
    if (token != null) {
      authReq = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token).set(SOURCE_ID_KEY, uuid)});
    }
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];
