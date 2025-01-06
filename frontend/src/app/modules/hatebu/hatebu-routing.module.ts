import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../shared/guards/auth.guard';
import { HatebuComponent } from './hatebu/hatebu.component';
import { EntriesComponent } from './entries/entries.component';
import { NgUrlsComponent } from './ng-urls/ng-urls.component';
import { NgWordsComponent } from './ng-words/ng-words.component';
import { NgDomainsComponent } from './ng-domains/ng-domains.component';

const routes: Routes = [
  { path: '', component: HatebuComponent, canActivate: [authGuard], children: [
    { path: 'index'     , component: EntriesComponent   },
    { path: 'ng-urls'   , component: NgUrlsComponent    },
    { path: 'ng-words'  , component: NgWordsComponent   },
    { path: 'ng-domains', component: NgDomainsComponent },
    
    { path: ''  , redirectTo: '/hatebu/index', pathMatch: 'full' },  // 未指定時
    { path: '**', redirectTo: '/hatebu/index'                    }   // 404
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HatebuRoutingModule { }
