import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
export class BookmarksController {
  constructor(
    private configService: ConfigService,
    private bookmarksService: BookmarksService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findAll(@Res() res: Response): Promise<Response> {
    const bookmarks = await this.bookmarksService.findAll();
    return res.status(HttpStatus.OK).json(bookmarks);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async create(@Body('url') url: string, @Res() res: Response): Promise<Response> {
    const insertResult = await this.bookmarksService.create(url);
    if(insertResult == null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Create Bookmark' });
    return res.status(HttpStatus.CREATED).end();
  }
  
  /** ブックマークレットからの呼び出し用 */
  @Get('add')
  public async addFromBookmarklet(@Query('credential') credential: string, @Query('url') url: string, @Res() res: Response): Promise<void | Response> {
    if(credential !== this.configService.get('password')) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid Credential' });
    const insertResult = await this.bookmarksService.create(url);
    if(insertResult == null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Create Bookmark' });
    return res.redirect('/bookmarks');
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async remove(@Param('id') id: number, @Res() res: Response): Promise<Response> {
    const deleteResult = await this.bookmarksService.remove(id);
    if(deleteResult == null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Remove Bookmark' });
    return res.status(HttpStatus.OK).end();
  }
}
