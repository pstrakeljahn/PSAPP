import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MetaWrapper, RestAdapterService } from './rest-adapter.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthInterceptor } from '../interceptors/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private user: Record<string, unknown> = null;

  get loggedIn(): boolean {
    return this.user !== null;
  }

  constructor(
    private http: HttpClient,
    private restAdapter: RestAdapterService,
    private interceptor: AuthInterceptor
  ) {}

  public login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<MetaWrapper<Record<string, unknown>>>(
        this.restAdapter.url + 'login',
        new HttpParams().set('username', username).set('password', password),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        }
      )
      .pipe(
        map((res: MetaWrapper<Record<string, unknown>>) => {
          if (res.meta.status === 200) {
            this.interceptor.setToken(res.data['token'] as string);
            return true;
          }
          return false;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    return of(false);
  }

  private logout() {
    this.user = null;
  }
}
