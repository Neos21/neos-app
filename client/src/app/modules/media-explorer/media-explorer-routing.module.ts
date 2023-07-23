import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../shared/guards/auth.guard';
import { MediaExplorerComponent } from './media-explorer/media-explorer.component';

const routes: Routes = [
  { path: '', component: MediaExplorerComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaExplorerRoutingModule { }
