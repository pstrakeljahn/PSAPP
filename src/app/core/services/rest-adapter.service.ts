import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import config from '../config/config.json';

export interface MetaWrapper<T> {
  meta: {
    method: string;
    status: number;
  };
  data: T;
  error: string[];
}

@Injectable({
  providedIn: 'root',
})
export class RestAdapterService {
  readonly url: string;

  constructor(private http: HttpClient) {
    this.url = config.backend + 'v' + config.apiVersion + '/';
  }

  public getObjectByID(
    objName: string,
    id: number
  ): Observable<Record<string, unknown>> {
    return this.http
      .get<MetaWrapper<Record<string, unknown>>>(
        this.url + 'obj/' + objName + '/' + id
      )
      .pipe(
        switchMap((data) => {
          return of(data.data);
        })
      );
  }

  public get(
    url: string,
    options: Array<Record<string, string | number | boolean>> = []
  ) {
    let httpParams: HttpParams = new HttpParams();

    for (const record of options) {
      for (const [key, value] of Object.entries(record)) {
        httpParams.set(key, value);
      }
    }

    return this.http.get<MetaWrapper<Record<string, unknown>>>(this.url + url, {
      params: httpParams,
    });
  }
}
