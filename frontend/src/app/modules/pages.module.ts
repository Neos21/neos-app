import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { IndexModule } from './index/index.module';

@NgModule({
  imports: [
    SharedModule,
    IndexModule
    // 遅延ロードモジュールは AppRoutingModule で読み込まれる
  ]
})
export class PagesModule { }
