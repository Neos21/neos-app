import { DeleteResult, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { NgDomain } from '../../entities/hatebu/ng-domain';

@Injectable()
export class NgDomainsService {
  constructor(
    @InjectRepository(NgDomain) private readonly ngDomainsRepository: Repository<NgDomain>
  ) { }
  
  public async findAll(): Promise<Array<NgDomain> | null> {
    return await this.ngDomainsRepository.find().catch(_error => null);
  }
  
  public async create(ngDomain: NgDomain): Promise<NgDomain | null> {
    const insertResult = await this.ngDomainsRepository.insert(ngDomain);
    const id = insertResult.identifiers?.[0]?.id;
    if(id == null) return null;  // Failed To Insert NgDomain
    return await this.ngDomainsRepository.findOneBy({ id }).catch(_error => null);
  }
  
  public async remove(id: number): Promise<DeleteResult | null> {
    return await this.ngDomainsRepository.delete(id).catch(_error => null);
  }
}
