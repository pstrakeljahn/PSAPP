import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public username: string = null;
  public password: string = null;
  public response: any = null;
  public isloggedIn: any;

  constructor(public loginService: LoginService, private router: Router) {}

  login() {
    if (this.username && this.password) {
      this.loginService.login(this.username, this.password).subscribe((res) => {
        this.router.navigate(['/home']);
      });
    }
  }
}
