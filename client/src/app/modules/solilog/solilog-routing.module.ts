import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../shared/guards/auth.guard';
import { SolilogComponent } from './solilog/solilog.component';
import { SearchSolilogComponent } from './search-solilog/search-solilog.component';

const routes: Routes = [
  { path: 'search', component: SearchSolilogComponent, canActivate: [authGuard] },
  { path: ''      , component: SolilogComponent      , canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolilogRoutingModule { }
