import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { FileUploaderController } from './file-uploader.controller';
import { FileUploaderService } from './file-uploader.service';

@Module({
  controllers: [
    FileUploaderController
  ],
  providers: [
    JwtService,
    FileUploaderService
  ]
})
export class FileUploaderModule { }
