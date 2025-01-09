import { Response } from 'express';

import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { NgUrl } from '../../entities/hatebu/ng-url';
import { NgUrlsService } from './ng-urls.service';

@Controller('hatebu/ng-urls')
export class NgUrlsController {
  constructor(
    private readonly ngUrlsService: NgUrlsService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findAll(@Res() response: Response): Promise<Response<Array<NgUrl>>> {
    const ngUrls = await this.ngUrlsService.findAll();
    return response.status(HttpStatus.OK).json(ngUrls);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async create(@Body() ngUrl: NgUrl, @Res() response: Response): Promise<Response<NgUrl>> {
    const createdNgUrl = await this.ngUrlsService.create(ngUrl);
    if(createdNgUrl == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Create NG Domain' });
    return response.status(HttpStatus.CREATED).json(createdNgUrl);
  }
}
