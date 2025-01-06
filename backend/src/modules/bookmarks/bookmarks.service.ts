import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

import { Bookmark } from '../../entities/bookmarks/bookmark';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark) private readonly bookmarksRepository: Repository<Bookmark>
  ) { }
  
  public async findAll(): Promise<Array<Bookmark> | null> {
    return await this.bookmarksRepository.find({ order: { id: 'DESC' }}).catch(_error => null);
  }
  
  public async create(url: string): Promise<InsertResult | null> {
    return await this.bookmarksRepository.insert(new Bookmark({ url })).catch(_error => null);
  }
  
  public async remove(id: number): Promise<DeleteResult | null> {
    return await this.bookmarksRepository.delete(id).catch(_error => null);
  }
}
