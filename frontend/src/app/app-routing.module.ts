import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'bookmarks'     , loadChildren: () => import('./modules/bookmarks/bookmarks.module'          ).then(module => module.BookmarksModule    ) },
  { path: 'notes'         , loadChildren: () => import('./modules/notes/notes.module'                  ).then(module => module.NotesModule        ) },
  { path: 'hatebu'        , loadChildren: () => import('./modules/hatebu/hatebu.module'                ).then(module => module.HatebuModule       ) },
  { path: 'ad-generator'  , loadChildren: () => import('./modules/ad-generator/ad-generator.module'    ).then(module => module.AdGeneratorModule  ) },
  { path: 'solilog'       , loadChildren: () => import('./modules/solilog/solilog.module'              ).then(module => module.SolilogModule      ) },
  { path: 'file-uploader' , loadChildren: () => import('./modules/file-uploader/file-uploader.module'  ).then(module => module.FileUploaderModule ) },
  { path: 'media-explorer', loadChildren: () => import('./modules/media-explorer/media-explorer.module').then(module => module.MediaExplorerModule) },
  
  { path: ''  , redirectTo: '/index', pathMatch: 'full' },  // 未指定時
  { path: '**', redirectTo: '/index'                    }   // 404
];

// アンカーで移動する
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 0]
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
