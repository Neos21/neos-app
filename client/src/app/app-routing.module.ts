import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'bookmarks', loadChildren: () => import('./modules/bookmarks/bookmarks.module').then(module => module.BookmarksModule) },  // 遅延ロード
  
  { path: '', redirectTo: '/index', pathMatch: 'full' }  // 空パス時はリダイレクトする
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
