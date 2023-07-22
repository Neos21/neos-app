import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { SolilogRoutingModule } from './solilog-routing.module';
import { SolilogComponent } from './solilog/solilog.component';
import { TimeToHashPipe } from './guards/time-to-hash.pipe';
import { SolilogService } from './services/solilog.service';
import { UrlToAnchorPipe } from './guards/url-to-anchor.pipe';

@NgModule({
  imports: [
    SharedModule,
    SolilogRoutingModule
  ],
  declarations: [
    SolilogComponent,
    TimeToHashPipe,
    UrlToAnchorPipe
  ],
  providers: [
    SolilogService
  ]
})
export class SolilogModule { }
