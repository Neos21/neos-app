import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';

import { Note } from '../../entities/notes/note';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>
  ) { }
  
  public async findOne(): Promise<Note | null> {
    return await this.notesRepository.findOneBy({ id: 1 }).catch(_error => null);
  }
  
  public async save(text: string): Promise<InsertResult | null> {
    return await this.notesRepository.upsert(new Note({ id: 1, text }), ['id']).catch(_error => null);
  }
}
