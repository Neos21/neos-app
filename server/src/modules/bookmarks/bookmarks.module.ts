import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bookmark } from '../../entities/bookmarks/bookmark/bookmark';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Bookmark
    ]),
  ],
  controllers: [
    BookmarksController
  ],
  providers: [
    JwtService,
    BookmarksService
  ]
})
export class BookmarksModule { }
