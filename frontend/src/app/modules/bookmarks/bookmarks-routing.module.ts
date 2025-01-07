import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../shared/guards/auth.guard';
import { BookmarksComponent } from './bookmarks/bookmarks.component';

const routes: Routes = [
  { path: '', component: BookmarksComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookmarksRoutingModule { }
