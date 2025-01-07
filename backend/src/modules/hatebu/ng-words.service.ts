import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { NgWord } from '../../entities/hatebu/ng-word';

@Injectable()
export class NgWordsService {
  constructor(
    @InjectRepository(NgWord) private readonly ngWordsRepository: Repository<NgWord>
  ) { }
  
  public async findAll(): Promise<Array<NgWord> | null> {
    return await this.ngWordsRepository.find().catch(_error => null);
  }
  
  public async create(ngWord: NgWord): Promise<NgWord | null> {
    const insertResult = await this.ngWordsRepository.insert(ngWord);
    const id = insertResult.identifiers?.[0]?.id;
    if(id == null) return null;  // Failed To Insert NgWord
    return await this.ngWordsRepository.findOneBy({ id }).catch(_error => null);
  }
  
  public async remove(id: number): Promise<DeleteResult | null> {
    return await this.ngWordsRepository.delete(id).catch(_error => null);
  }
}
