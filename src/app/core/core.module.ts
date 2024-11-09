import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './interceptors/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginService } from './services/login.service';
import { UserService } from './services/user.service';
import { ConfigService } from './services/config.service';
import { RestAdapterService } from './services/rest-adapter.service';

export function initConfig(configService: ConfigService) {
  return () => configService.init();
}

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthInterceptor,
    RestAdapterService,
    LoginService,
    UserService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true,
    },
  ],
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  exports: [],
})
export class CoreModule {}
