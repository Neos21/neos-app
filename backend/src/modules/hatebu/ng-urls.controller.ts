import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { NgUrl } from '../../entities/hatebu/ng-url';
import { NgUrlsService } from './ng-urls.service';

@Controller('hatebu/ng-urls')
export class NgUrlsController {
  constructor(
    private ngUrlsService: NgUrlsService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findAll(@Res() res: Response): Promise<Response> {
    const ngUrls = await this.ngUrlsService.findAll();
    return res.status(HttpStatus.OK).json(ngUrls);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async create(@Body() ngUrl: NgUrl, @Res() res: Response): Promise<Response> {
    const createdNgUrl = await this.ngUrlsService.create(ngUrl);
    if(createdNgUrl == null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Create NG Domain' });
    return res.status(HttpStatus.CREATED).json(createdNgUrl);
  }
}
