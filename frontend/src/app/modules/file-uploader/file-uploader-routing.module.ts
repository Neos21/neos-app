import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../../shared/guards/auth.guard';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';

const routes: Routes = [
  { path: '', component: FileUploaderComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileUploaderRoutingModule { }
