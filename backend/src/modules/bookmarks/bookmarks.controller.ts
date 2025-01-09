import { Response } from 'express';

import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Bookmark } from '../../entities/bookmarks/bookmark';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
export class BookmarksController {
  constructor(
    private readonly configService: ConfigService,
    private readonly bookmarksService: BookmarksService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findAll(@Res() response: Response): Promise<Response<Array<Bookmark>>> {
    const bookmarks = await this.bookmarksService.findAll();
    return response.status(HttpStatus.OK).json(bookmarks);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async create(@Body('url') url: string, @Res() response: Response): Promise<Response<void>> {
    const insertResult = await this.bookmarksService.create(url);
    if(insertResult == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Create Bookmark' });
    return response.status(HttpStatus.CREATED).end();
  }
  
  /** ブックマークレットからの呼び出し用 */
  @Get('add')
  public async addFromBookmarklet(@Query('credential') credential: string, @Query('url') url: string, @Res() response: Response): Promise<void | Response> {
    if(credential !== this.configService.get('password')) return response.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid Credential' });
    const insertResult = await this.bookmarksService.create(url);
    if(insertResult == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Create Bookmark' });
    return response.redirect('/bookmarks');
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async remove(@Param('id') id: number, @Res() response: Response): Promise<Response<void>> {
    const deleteResult = await this.bookmarksService.remove(id);
    if(deleteResult == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Remove Bookmark' });
    return response.status(HttpStatus.OK).end();
  }
}
