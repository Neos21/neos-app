import { Response } from 'express';

import { Body, Controller, Delete, Get, HttpStatus, ParseIntPipe, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { SolilogService } from './solilog.service';

@Controller('solilog')
export class SolilogController {
  constructor(
    private readonly configService: ConfigService,
    private readonly solilogService: SolilogService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async getList(@Res() response: Response): Promise<Response<Array<string>>> {
    const list = await this.solilogService.getList();
    return response.status(HttpStatus.OK).json(list);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('posts')
  public async getPosts(@Query('t') yearMonth: string, @Res() response: Response): Promise<Response<{ t: string, posts: Array<{ id: number; time: string; text: string; }>; }>> {  // `t` = Time
    const posts = await this.solilogService.getPosts(yearMonth);
    if(posts == null) return response.status(HttpStatus.NOT_FOUND).json({ error: 'Posts Not Found' });
    return response.status(HttpStatus.OK).json(posts);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('posts')
  public async post(@Body('text') text: string, @Res() response: Response): Promise<Response<void>> {
    const isSucceeded = await this.solilogService.post(text);
    if(!isSucceeded) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Post '});
    return response.status(HttpStatus.OK).end();
  }
  
  /** ブックマークレットからの呼び出し用 */
  @Get('posts/add')
  public async addFromBookmarklet(@Query('credential') credential: string, @Query('text') text: string, @Res() response: Response): Promise<void | Response> {
    if(credential !== this.configService.get('password')) return response.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid Credential' });
    const isSucceeded = await this.solilogService.post(text);
    if(!isSucceeded) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Post '});
    return response.redirect('/solilog');
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete('posts')
  public async remove(@Body('t') yearMonth: string, @Body('id', ParseIntPipe) id: number, @Res() response: Response): Promise<Response<void>> {
    const isSucceeded = await this.solilogService.remove(yearMonth, id);
    if(!isSucceeded) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Remove' });
    return response.status(HttpStatus.OK).end();
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('search')
  public async search(@Query('q') keyword: string, @Res() response: Response): Promise<Response<Array<{ time: string; text: string; }>>> {
    const results = await this.solilogService.search(keyword);
    if(results == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Search' });
    return response.status(HttpStatus.OK).json(results);
  }
}
