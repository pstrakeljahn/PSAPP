import { Component } from '@angular/core';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private loginService: LoginService) {}

  public logout() {
    this.loginService.logout();
  }
}
