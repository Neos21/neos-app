import { NgModule } from '@angular/core';

// Imports
import { SharedModule } from '../../shared/shared.module';
import { IndexRoutingModule } from './index-routing.module';
// Declarations
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
