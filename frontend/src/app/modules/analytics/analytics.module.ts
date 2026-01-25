import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AnalyticsService } from './services/analytics.service';

@NgModule({
  imports: [
    SharedModule,
    AnalyticsRoutingModule
  ],
  declarations: [
    AnalyticsComponent
  ],
  providers: [
    AnalyticsService
  ]
})
export class AnalyticsModule { }
