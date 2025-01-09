import { DeleteResult, InsertResult, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Note } from '../../entities/notes/note';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly notesRepository: Repository<Note>
  ) { }
  
  public async findAll(): Promise<Array<Note> | null> {
    return await this.notesRepository.find({ select: { id: true },  order: { id: 'ASC' } }).catch(_error => null);
  }
  
  public async findOne(id: number): Promise<Note | null> {
    return await this.notesRepository.findOneBy({ id }).catch(_error => null);
  }
  
  public async create(): Promise<Note | null> {
    return await this.notesRepository.save(new Note({ text: '' })).catch(_error => null);
  }
  
  public async save(id: number, text: string): Promise<Note | null> {
    return await this.notesRepository.save(new Note({ id, text })).catch(_error => null);
  }
  
  public async remove(id: number): Promise<DeleteResult | null> {
    return await this.notesRepository.delete({ id }).catch(_error => null);
  }
}
