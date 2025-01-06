import { Injectable } from '@angular/core';

import { NgUrl } from '../classes/ng-url';
import { Category } from '../classes/category';
import { NgWord } from '../classes/ng-word';
import { NgDomain } from '../classes/ng-domain';
import { CategoriesService } from './categories.service';
import { NgUrlsService } from './ng-urls.service';
import { NgWordsService } from './ng-words.service';
import { NgDomainsService } from './ng-domains.service';

@Injectable()
export class ApiService {
  constructor(
    public categories: CategoriesService,
    public ngUrls: NgUrlsService,
    public ngWords: NgWordsService,
    public ngDomains: NgDomainsService
  ) { }
  
  /** 全ての情報を取得する */
  public async fetchAll(): Promise<{ categories: Array<Category>; ngUrls: Array<NgUrl>; ngWords: Array<NgWord>; ngDomains: Array<NgDomain> }> {
    const [categories, ngUrls, ngWords, ngDomains] = await Promise.all([
      this.categories.findAll(),
      this.ngUrls.findAll(),
      this.ngWords.findAll(),
      this.ngDomains.findAll()
    ]);
    return { categories, ngUrls, ngWords, ngDomains };
  }
}
