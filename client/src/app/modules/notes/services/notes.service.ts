import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Note } from '../classes/note';

@Injectable()
export class NotesService {
  constructor(
    private httpClient: HttpClient
  ) { }
  
  public async findOne(): Promise<Note> {
    return await firstValueFrom(this.httpClient.get<Note>('/api/notes'));
  }
  
  public async save(text: string): Promise<void> {
    return await firstValueFrom(this.httpClient.post<void>('/api/notes', { text }));
  }
}
