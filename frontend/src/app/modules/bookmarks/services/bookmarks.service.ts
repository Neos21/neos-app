import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Bookmark } from '../classes/bookmark';

@Injectable()
export class BookmarksService {
  constructor(
    private readonly httpClient: HttpClient
  ) { }
  
  public async findAll(): Promise<Array<Bookmark>> {
    return await firstValueFrom(this.httpClient.get<Array<Bookmark>>('/api/bookmarks'));
  }
  
  public async create(url: string): Promise<void> {
    return await firstValueFrom(this.httpClient.post<void>('/api/bookmarks', { url }));
  }
  
  public async remove(id: number): Promise<void> {
    return await firstValueFrom(this.httpClient.delete<void>(`/api/bookmarks/${id}`));
  }
}
