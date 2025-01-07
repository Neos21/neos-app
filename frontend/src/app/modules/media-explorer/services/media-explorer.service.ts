import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MediaExplorerService {
  constructor(
    private readonly httpClient: HttpClient
  ) { }
  
  public async gitPull(): Promise<{ result: string; }> {
    return await firstValueFrom(this.httpClient.post<{ result: string; }>('/api/media-explorer/git-pull', {}));
  }
  
  public async fetchCurrentJson(): Promise<{ year: string; names: Array<string>; }> {
    const current = await firstValueFrom(this.httpClient.get<{ year: string; names: Array<string>; }>('/api/media-explorer/names/current.json'));
    current.names = current.names.reverse();
    return current;
  }
  
  public async fetchPastJson(): Promise<Array<{ year: string; names: Array<string>; }>> {
    const past = await firstValueFrom(this.httpClient.get<Array<{ year: string; names: Array<string>; }>>('/api/media-explorer/names/past.json'));
    const reversedPast = past.reverse();
    reversedPast.forEach(item => item.names = item.names.reverse());
    return reversedPast;
  }
  
  public async fetchFamilyJson(): Promise<{ title: string; names: Array<string>; }> {
    const family = await firstValueFrom(this.httpClient.get<{ title: string; names: Array<string>; }>('/api/media-explorer/names/family.json'));
    family.names = family.names.reverse();
    return family;
  }
  
  public getThumbnailUrl(year: string, ymd: string): string {
    return `/api/media-explorer/thumbnails/${year}/${ymd}.jpg`;
  }
}
