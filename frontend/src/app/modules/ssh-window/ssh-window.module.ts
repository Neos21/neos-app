import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { SshWindowService } from './services/ssh-window.service';
import { SshWindowRoutingModule } from './ssh-window-routing.module';
import { SshWindowComponent } from './ssh-window/ssh-window.component';

@NgModule({
  imports: [
    SharedModule,
    SshWindowRoutingModule
  ],
  declarations: [
    SshWindowComponent
  ],
  providers: [
    SshWindowService
  ]
})
export class SshWindowModule { }
