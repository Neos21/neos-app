import { firstValueFrom } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Note } from '../classes/note';

@Injectable()
export class NotesService {
  constructor(
    private readonly httpClient: HttpClient
  ) { }
  
  public async findAll(): Promise<Array<Note>> {
    return await firstValueFrom(this.httpClient.get<Array<Note>>('/api/notes'));
  }
  
  public async findOne(id: number): Promise<Note> {
    return await firstValueFrom(this.httpClient.get<Note>(`/api/notes/${id}`));
  }
  
  public async create(): Promise<Note> {
    return await firstValueFrom(this.httpClient.post<Note>('/api/notes', {}));
  }
  
  public async save(id: number, text: string): Promise<Note> {
    return await firstValueFrom(this.httpClient.put<Note>(`/api/notes/${id}`, { text }));
  }
  
  public async remove(id: number): Promise<void> {
    return await firstValueFrom(this.httpClient.delete<void>(`/api/notes/${id}`));
  }
}
