import { Injectable } from '@angular/core';
import { RestAdapterService } from './rest-adapter.service';
import { map, Observable, of, switchMap } from 'rxjs';

export interface User {
  ID: number;
  username: string;
  mail: string;
  firstName: string;
  lastname: string;
  _createdAt: string;
  _createdBy: string;
  _modfiedAt: string;
  _modifiedBy: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user: User = null;

  constructor(private restAdapter: RestAdapterService) {}

  public get user(): User {
    return this._user;
  }

  public getUser(): Observable<User> {
    return this.restAdapter.get('core/getUser').pipe(
      map((res) => {
        this._user = res.data as unknown as User;
      }),
      switchMap(() => {
        return of(this._user);
      })
    );
  }
}
