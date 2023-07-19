import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { BookmarksService } from './bookmarks.service';

@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(
    private bookmarksService: BookmarksService
  ) { }
  
  @Get('')
  public async findAll(@Res() res: Response): Promise<Response> {
    const bookmarks = await this.bookmarksService.findAll();
    return res.status(HttpStatus.OK).json(bookmarks);
  }
  
  @Post('')
  public async create(@Body('url') url: string, @Res() res: Response): Promise<Response> {
    const insertResult = await this.bookmarksService.create(url);
    if(insertResult == null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Create Bookmark' });
    return res.status(HttpStatus.CREATED).end();
  }
  
  @Delete(':id')
  public async remove(@Param('id') id: number, @Res() res: Response): Promise<Response> {
    const deleteResult = await this.bookmarksService.remove(id);
    if(deleteResult == null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Remove Bookmark' });
    return res.status(HttpStatus.OK).end();
  }
}
