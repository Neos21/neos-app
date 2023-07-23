import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { MediaExplorerController } from './media-explorer.controller';
import { MediaExplorerService } from './media-explorer.service';

@Module({
  controllers: [
    MediaExplorerController
  ],
  providers: [
    JwtService,
    MediaExplorerService
  ]
})
export class MediaExplorerModule { }
