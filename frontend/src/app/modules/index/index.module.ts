import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    SharedModule,
    IndexRoutingModule
  ],
  declarations: [
    IndexComponent,
    LoginComponent
  ]
})
export class IndexModule { }
