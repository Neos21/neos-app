import { Body, Controller, Delete, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { SolilogService } from './solilog.service';

@Controller('solilog')
export class SolilogController {
  constructor(
    private configService: ConfigService,
    private solilogService: SolilogService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async getList(@Res() res: Response): Promise<Response> {
    const list = await this.solilogService.getList();
    return res.status(HttpStatus.OK).json(list);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('posts')
  public async getPosts(@Query('t') yearMonth: string, @Res() res: Response): Promise<Response> {  // `t` = Time
    const posts = await this.solilogService.getPosts(yearMonth);
    if(posts == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'Posts Not Found' });
    return res.status(HttpStatus.OK).json(posts);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('posts')
  public async post(@Body('text') text: string, @Res() res: Response): Promise<Response> {
    const isSucceeded = await this.solilogService.post(text);
    if(!isSucceeded) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Post '});
    return res.status(HttpStatus.OK).end();
  }
  
  /** ブックマークレットからの呼び出し用 */
  @Get('posts/add')
  public async addFromBookmarklet(@Query('credential') credential: string, @Query('text') text: string, @Res() res: Response): Promise<void | Response> {
    if(credential !== this.configService.get('password')) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid Credential' });
    const isSucceeded = await this.solilogService.post(text);
    if(!isSucceeded) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Post '});
    return res.redirect('/solilog');
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete('posts')
  public async remove(@Body('t') yearMonth: string, @Body('id') id: number, @Res() res: Response): Promise<Response> {
    const isSucceeded = await this.solilogService.remove(yearMonth, id);
    if(!isSucceeded) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Remove' });
    return res.status(HttpStatus.OK).end();
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('search')
  public async search(@Query('q') keyword: string, @Res() res: Response): Promise<Response> {
    const results = await this.solilogService.search(keyword);
    if(results == null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Search' });
    return res.status(HttpStatus.OK).json(results);
  }
}
