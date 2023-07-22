import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { NotesRoutingModule } from './notes-routing.module';
import { NotesComponent } from './notes/notes.component';
import { NotesService } from './services/notes.service';

@NgModule({
  imports: [
    SharedModule,
    NotesRoutingModule
  ],
  declarations: [
    NotesComponent
  ],
  providers: [
    NotesService
  ]
})
export class NotesModule { }
