import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../shared/guards/auth.guard';
import { AdGeneratorComponent } from './ad-generator/ad-generator.component';

const routes: Routes = [
  { path: '', component: AdGeneratorComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdGeneratorRoutingModule { }
