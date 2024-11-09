import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MetaWrapper, RestAdapterService } from './rest-adapter.service';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { AuthInterceptor } from '../interceptors/auth.service';
import { Config, ConfigService } from './config.service';
import { User, UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private restAdapter: RestAdapterService,
    private interceptor: AuthInterceptor,
    private configService: ConfigService,
    private userService: UserService
  ) {}

  public login(username: string, password: string): Observable<User & Config> {
    return this.loginRequest(username, password).pipe(
      switchMap((success: boolean) => {
        return forkJoin({
          user: success ? this.userService.getUser() : of([]),
          config: success ? this.configService.loadServerConfig() : of([]),
        });
      }),
      map((res) => {
        this.isLoggedIn.next(true);
        return { ...res.user, ...res.config } as User & Config;
      })
    );
  }

  public loginRequest(username: string, password: string): Observable<boolean> {
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
    this.isLoggedIn.next(false);
  }
}
