import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '../../entities/hatebu/category';
import { Entry } from '../../entities/hatebu/entry';
import { NgDomain } from '../../entities/hatebu/ng-domain';
import { NgUrl } from '../../entities/hatebu/ng-url';
import { NgWord } from '../../entities/hatebu/ng-word';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { NgDomainsController } from './ng-domains.controller';
import { NgDomainsService } from './ng-domains.service';
import { NgUrlsController } from './ng-urls.controller';
import { NgUrlsService } from './ng-urls.service';
import { NgWordsController } from './ng-words.controller';
import { NgWordsService } from './ng-words.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Category,
      Entry,
      NgUrl,
      NgWord,
      NgDomain
    ])
  ],
  controllers: [
    CategoriesController,
    NgUrlsController,
    NgWordsController,
    NgDomainsController
  ],
  providers: [
    JwtService,
    CategoriesService,
    NgUrlsService,
    NgWordsService,
    NgDomainsService
  ],
  exports: [  // `AppModule` で使うためエクスポートする
    CategoriesService,
    NgUrlsService
  ]
})
export class HatebuModule { }
