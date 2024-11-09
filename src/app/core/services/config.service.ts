import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import config from '../config/config.json';
import { RestAdapterService } from './rest-adapter.service';

export interface ConfigJson {
  backend: string;
  apiVersion: string;
}

export interface ConfigServer {
  debug: boolean;
}

export interface Config extends ConfigJson, ConfigServer {}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _config: Config = null;
  private _configJson: ConfigJson;

  get getConfig() {
    return this._config;
  }

  constructor(private restAdapter: RestAdapterService) {}

  public init(): Observable<boolean> {
    this._configJson = config;
    return of(true);
  }

  public loadServerConfig(): Observable<Config> {
    return this.restAdapter.get('core/getConfig').pipe(
      map((res) => {
        this._config = {
          ...this._configJson,
          ...(res.data as unknown as ConfigServer),
        };
      }),
      switchMap(() => {
        return of(this._config);
      })
    );
  }
}
