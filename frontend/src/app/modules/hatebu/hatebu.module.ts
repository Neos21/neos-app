import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { EntriesComponent } from './entries/entries.component';
import { HatebuRoutingModule } from './hatebu-routing.module';
import { HatebuComponent } from './hatebu/hatebu.component';
import { NgDomainsComponent } from './ng-domains/ng-domains.component';
import { NgUrlsComponent } from './ng-urls/ng-urls.component';
import { NgWordsComponent } from './ng-words/ng-words.component';
import { HatebuUrlPipe } from './pipes/hatebu-url.pipe';
import { IsoToJstPipe } from './pipes/iso-to-jst.pipe';
import { SlashToHyphenPipe } from './pipes/slash-to-hyphen.pipe';
import { ApiService } from './services/api.service';
import { CategoriesService } from './services/categories.service';
import { NgDomainsService } from './services/ng-domains.service';
import { NgUrlsService } from './services/ng-urls.service';
import { NgWordsService } from './services/ng-words.service';
import { PageTitleService } from './services/page-title.service';

@NgModule({
  imports: [
    SharedModule,
    HatebuRoutingModule
  ],
  declarations: [
    HatebuComponent,
    EntriesComponent,
    NgUrlsComponent,
    NgWordsComponent,
    NgDomainsComponent,
    // Pipes
    HatebuUrlPipe,
    IsoToJstPipe,
    SlashToHyphenPipe
  ],
  providers: [
    ApiService,
    CategoriesService,
    NgUrlsService,
    NgWordsService,
    NgDomainsService,
    PageTitleService
  ]
})
export class HatebuModule { }
