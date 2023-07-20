import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'bookmarks'   , loadChildren: () => import('./modules/bookmarks/bookmarks.module'      ).then(module => module.BookmarksModule  ) },
  { path: 'notes'       , loadChildren: () => import('./modules/notes/notes.module'              ).then(module => module.NotesModule      ) },
  { path: 'hatebu'      , loadChildren: () => import('./modules/hatebu/hatebu.module'            ).then(module => module.HatebuModule     ) },
  { path: 'ad-generator', loadChildren: () => import('./modules/ad-generator/ad-generator.module').then(module => module.AdGeneratorModule) },
  
  { path: ''  , redirectTo: '/index', pathMatch: 'full' },  // 未指定時
  { path: '**', redirectTo: '/index'                    }   // 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
