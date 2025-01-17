import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { TimeToHashPipe } from './pipes/time-to-hash.pipe';
import { TimeToYearMonthPipe } from './pipes/time-to-year-month.pipe';
import { UrlToAnchorPipe } from './pipes/url-to-anchor.pipe';
import { SearchSolilogComponent } from './search-solilog/search-solilog.component';
import { SolilogService } from './services/solilog.service';
import { SolilogRoutingModule } from './solilog-routing.module';
import { SolilogComponent } from './solilog/solilog.component';

@NgModule({
  imports: [
    SharedModule,
    SolilogRoutingModule
  ],
  declarations: [
    SolilogComponent,
    SearchSolilogComponent,
    TimeToHashPipe,
    TimeToYearMonthPipe,
    UrlToAnchorPipe
  ],
  providers: [
    SolilogService
  ]
})
export class SolilogModule { }
