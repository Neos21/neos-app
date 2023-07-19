import { NgModule } from '@angular/core';

// Imports
import { SharedModule } from '../../shared/shared.module';
import { BookmarksRoutingModule } from './bookmarks-routing.module';
// Declarations
import { BookmarksComponent } from './bookmarks/bookmarks.component';
// Providers
import { BookmarksService } from './services/bookmarks.service';

@NgModule({
  imports: [
    SharedModule,
    BookmarksRoutingModule
  ],
  declarations: [
    BookmarksComponent
  ],
  providers: [
    BookmarksService
  ]
})
export class BookmarksModule { }
