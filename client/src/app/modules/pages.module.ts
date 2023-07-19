import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { IndexModule } from './index/index.module';

@NgModule({
  imports: [
    SharedModule,
    IndexModule
  ]
})
export class PagesModule { }
