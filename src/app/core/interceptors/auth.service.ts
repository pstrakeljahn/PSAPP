import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestAdapterService } from '../services/rest-adapter.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private restAdapter: RestAdapterService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq: HttpRequest<any>;

    if (req.url !== this.restAdapter.url + 'login') {
      const authToken = localStorage.getItem('authToken');
      authReq = authToken
        ? req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authToken}`),
          })
        : req;
    } else {
      authReq = req;
    }

    return next.handle(authReq);
  }

  public setToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  public removeToken(): void {
    localStorage.removeItem('authToken');
  }
}
