import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { FileUploaderRoutingModule } from './file-uploader-routing.module';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FileUploaderService } from './services/file-uploader.service';

@NgModule({
  imports: [
    SharedModule,
    FileUploaderRoutingModule
  ],
  declarations: [
    FileUploaderComponent
  ],
  providers: [
    FileUploaderService
  ]
})
export class FileUploaderModule { }
