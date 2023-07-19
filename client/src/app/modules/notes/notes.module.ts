import { NgModule } from '@angular/core';

// Imports
import { SharedModule } from '../../shared/shared.module';
import { NotesRoutingModule } from './notes-routing.module';
// Declarations
import { NotesComponent } from './notes/notes.component';
// Providers
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
