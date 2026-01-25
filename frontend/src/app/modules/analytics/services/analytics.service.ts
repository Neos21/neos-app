import { firstValueFrom } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Log } from '../classes/log';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly httpClient: HttpClient
  ) { }
  
  public async find(id: number, ymd: string): Promise<{ result: Array<Log>; }> {
    return await firstValueFrom(this.httpClient.get<{ result: Array<Log>; }>(`/api/analytics?id=${id}&ymd=${ymd}`));
  }
}
