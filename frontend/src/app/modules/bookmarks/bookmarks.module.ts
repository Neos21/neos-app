import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { BookmarksRoutingModule } from './bookmarks-routing.module';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
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
