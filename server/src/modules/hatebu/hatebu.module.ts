import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

// Imports
import { Category } from '../../entities/hatebu/category';
import { Entry } from '../../entities/hatebu/entry';
import { NgWord } from '../../entities/hatebu/ng-word';
import { NgUrl } from '../../entities/hatebu/ng-url';
import { NgDomain } from '../../entities/hatebu/ng-domain';
// Controllers
import { CategoriesController } from './categories.controller';
import { NgUrlsController } from './ng-urls.controller';
import { NgWordsController } from './ng-words.controller';
import { NgDomainsController } from './ng-domains.controller';
// Providers
import { CategoriesService } from './categories.service';
import { NgUrlsService } from './ng-urls.service';
import { NgWordsService } from './ng-words.service';
import { NgDomainsService } from './ng-domains.service';

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
