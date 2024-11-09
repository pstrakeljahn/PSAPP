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
  private user: User;

  constructor(private restAdapter: RestAdapterService) {}

  public getUser(): Observable<User> {
    return this.restAdapter.get('core/getUser').pipe(
      map((res) => {
        this.user = res.data as unknown as User;
      }),
      switchMap(() => {
        return of(this.user);
      })
    );
  }
}
