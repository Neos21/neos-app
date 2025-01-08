import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../shared/guards/auth.guard';
import { SshWindowComponent } from './ssh-window/ssh-window.component';

const routes: Routes = [
  { path: '', component: SshWindowComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SshWindowRoutingModule { }
