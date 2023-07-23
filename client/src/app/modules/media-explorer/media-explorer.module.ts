import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { MediaExplorerRoutingModule } from './media-explorer-routing.module';
import { MediaExplorerComponent } from './media-explorer/media-explorer.component';
import { MediaExplorerService } from './services/media-explorer.service';

@NgModule({
  imports: [
    SharedModule,
    MediaExplorerRoutingModule
  ],
  declarations: [
    MediaExplorerComponent
  ],
  providers: [
    MediaExplorerService
  ]
})
export class MediaExplorerModule { }
