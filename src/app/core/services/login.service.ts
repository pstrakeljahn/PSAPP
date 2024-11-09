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
import { Router } from '@angular/router';

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
    private userService: UserService,
    private router: Router
  ) {}

  public checkExistingToken() {
    const token: string = localStorage.getItem('authToken');
    if (token) {
      forkJoin({
        user: this.userService.getUser(),
        config: this.configService.loadServerConfig(),
      })
        .pipe(
          map((res) => {
            this.isLoggedIn.next(true);
            return { ...res.user, ...res.config } as User & Config;
          })
        )
        .subscribe(() => {
          this.router.navigate(['/home']);
        });
    }
  }

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

  public logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/home/login']);
    this.isLoggedIn.next(false);
  }
}
