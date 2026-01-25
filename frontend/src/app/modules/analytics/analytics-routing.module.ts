import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../shared/guards/auth.guard';
import { AnalyticsComponent } from './analytics/analytics.component';

const routes: Routes = [
  { path: '', component: AnalyticsComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
