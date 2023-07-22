import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SolilogComponent } from './solilog/solilog.component';

const routes: Routes = [
  { path: '', component: SolilogComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolilogRoutingModule { }
