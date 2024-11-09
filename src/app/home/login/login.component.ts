import { Component } from '@angular/core';
import { map, of, switchMap, tap } from 'rxjs';
import {
  ConfigServer,
  ConfigService,
} from 'src/app/core/services/config.service';
import { LoginService } from 'src/app/core/services/login.service';
import { User, UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public username: string = null;
  public password: string = null;
  public response: any = null;

  constructor(
    private loginService: LoginService,
    private configService: ConfigService,
    private userService: UserService
  ) {}

  login() {
    if (this.username && this.password) {
      this.loginService
        .login(this.username, this.password)
        .pipe(
          switchMap((success: boolean) => {
            if (success) {
              return this.userService.getUser();
            } else {
              return of([]);
            }
          }),
          tap((user) => {
            this.response = user;
          }),
          switchMap(() => {
            return this.configService.loadServerConfig();
          }),
          tap((config) => {
            this.response = { ...config, ...this.response };
          })
        )
        .subscribe();
    }
  }
}
