import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Dictionary } from '../../entities/dictionaries/dictionary';
import { MediaExplorerController } from './media-explorer.controller';
import { MediaExplorerService } from './media-explorer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dictionary
    ])
  ],
  controllers: [
    MediaExplorerController
  ],
  providers: [
    JwtService,
    MediaExplorerService
  ]
})
export class MediaExplorerModule { }
